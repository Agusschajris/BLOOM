import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Bloque from '../../components/block';
import data from "../../public/blocks.json";
import styles from '../../styles/proyecto.module.scss';
import Image from 'next/image';
import homeSVG from '../../public/home.svg';
import masSVG from '../../public/mas.svg';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import * as tf from '@tensorflow/tfjs';
import { Project } from '@prisma/client';
import Prism from 'prismjs';

type ArgValue = undefined | null | StoredArgValue;
type StoredArgValue = number | [number, number] | [number, number, number] | string;

interface DataBlock {
  id: string;
  visualName: string;
  funName: string;
  args: { [key: string]: StoredArgValue };
}

type Block = {
  visualName: string;
  exp: string;
  category: string;
  funName: string;
  args: Argument[];
};

type Argument = {
  visualName: string;
  exp: string;
  argName: string;
  type: string;
  values: undefined | null | string | (string | null)[];
  default: ArgValue;
  value: ArgValue;
};

interface BlockInstance extends Block {
  id: string;
}

export type { BlockInstance, Argument };

const Proyecto: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [canvasBlocks, setCanvasBlocks] = useState<BlockInstance[]>([]);
  const [showCanvasElements, setShowCanvasElements] = useState(false);

  let projectName = useRef<string>('');
  let generatedCode = useRef<string>('');

  useEffect(() => {
    if (id) {
      fetch(`/api/projects/${id}`, {
        method: 'GET'
      }).then(response => {
        if (response.status !== 200)
          return handle404();

        response.json().then((project: Project) => {
            projectName.current = project.name;
            setCanvasBlocks((project.blocks as any as DataBlock[]).map(getFrontendBlock));
        })
      });
    }
  }, [id]);

  function handle404() {
    // TODO: Implement project not found 404 page
  }

  const handleClick = () => {
    router.push('/').then();
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination)
      return;

    if (source.droppableId === 'blocksList' && destination.droppableId === 'canvas') {
      const newBlock = { ...data[source.index], id: `canvas-${canvasBlocks.length}` } as BlockInstance;
      setCanvasBlocks([...canvasBlocks, newBlock]);
    } else if (source.droppableId === 'canvas' && destination.droppableId === 'blocksList') {
      const newCanvasBlocks = canvasBlocks.filter((_, index) => index !== source.index);
      setCanvasBlocks(newCanvasBlocks);
    } else if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      const reorderedCanvasBlocks = Array.from(canvasBlocks);
      const [movedBlock] = reorderedCanvasBlocks.splice(source.index, 1);
      reorderedCanvasBlocks.splice(destination.index, 0, movedBlock);
      setCanvasBlocks(reorderedCanvasBlocks);
    }
  };

  const handleAddCanvasElement = () => {
    setShowCanvasElements(true);
  };

  const handleSaveArgs = (id: string, newArgs: Argument[]) => {
    setCanvasBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, args: newArgs } : block
      )
    );
  };

  function getBackendBlock(block: BlockInstance): DataBlock {
    const args = block.args.reduce((acc, arg) => {
      if (arg.value !== undefined && arg.value !== null) {
        acc[arg.argName] = arg.value as StoredArgValue;
      }
      return acc;
    }, {} as { [key: string]: StoredArgValue });

    return {
      id: block.id,
      visualName: block.visualName,
      funName: block.funName,
      args
    };
  }

  function getFrontendBlock(dataBlock: DataBlock): BlockInstance {
    const blockReference = data.find((block) => block.funName === dataBlock.funName) as Block;
    const rebuiltBlock = {...blockReference, id: dataBlock.id} as BlockInstance;
    rebuiltBlock.args.forEach((arg) => {
        arg.value = dataBlock.args[arg.argName] as ArgValue;
    });
    return rebuiltBlock;
  }

  const generateModel = async (blockInstances: BlockInstance[]) => {
    const blocks = blockInstances.map(getBackendBlock);
    const seq = tf.sequential({ name: projectName.current });

    blocks.forEach((block) => {
      seq.add(
        (tf.layers[block.funName as keyof typeof tf.layers] as (
          args: any
        ) => tf.layers.Layer)(block.args)
      );
    });

    // TODO: save model somewhere, then accessible in the generated code to train it or sth...
  };

  useEffect(() => {
    const blocks: DataBlock[] = canvasBlocks.map(getBackendBlock);
    
    generatedCode.current = `import * as tf from '@tensorflow/tfjs';\n\nconst model = tf.sequential({name: ${projectName.current});\n\n`;

    blocks.forEach((block) => {
      generatedCode.current += `model.add(tf.layers.${block.funName}(${JSON.stringify(block.args)}));\n`;
    });

    generatedCode.current += "\nmodel.compile({\n  optimizer: 'sgd',\n  loss: 'meanSquaredError',\n  metrics: ['accuracy'],\n});\n";

  }, [canvasBlocks]);

  useEffect(() => {
    if (!id || !projectName.current) return

    const blocks: DataBlock[] = canvasBlocks.map(getBackendBlock);
    fetch(`http://localhost:3000/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blocks }),
    }).then();
  }, [canvasBlocks, id]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <button className={styles.home} onClick={handleClick}>
            <Image src={homeSVG} alt="home" width={24} height={24} />
          </button>
          <h1 className={styles.name}>{projectName.current}</h1>
          <button className={styles.export}>Exportar</button>
        </header>

        <div className={styles.container}>
          <aside className={styles.blocksAside}>
            <h1 className={styles.h1}>CAPAS</h1>
            <Droppable droppableId="blocksList">
              {(provided: DroppableProvided) => (
                <div className={styles.blocksWrap} {...provided.droppableProps} ref={provided.innerRef}>
                  {data.map((block, index) => (
                    <Draggable key={block.visualName} draggableId={block.visualName} index={index}>
                      {(provided: DraggableProvided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Bloque block={{...block as Block, id: `block-${index}`}} isInBlockList={true} isInCanvas={false} onSave={() => {}} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </aside>

          <div className={styles.canvas}>
            <div className={styles.dataSet}>
              <h1>DataSet</h1>
            </div>
            {!showCanvasElements && (
              <button className={styles.mas} onClick={handleAddCanvasElement}>
                <Image src={masSVG} alt="more" width={15} height={15} />
              </button>
            )}
            {showCanvasElements && (
              <>
                <div className={styles.line}></div>
                <Droppable droppableId="canvas">
                  {(provided: DroppableProvided) => (
                    <div className={styles.canvasContainer} {...provided.droppableProps} ref={provided.innerRef}>
                      <h1>Tf.Sequential</h1>
                      {canvasBlocks.map((block, index) => (
                        <Draggable key={block.id} draggableId={block.id} index={index}>
                          {(provided: DraggableProvided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Bloque
                                block={block}
                                isInBlockList={false}
                                isInCanvas={true}
                                onSave={(newArgs) => handleSaveArgs(block.id, newArgs)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <p className={styles.bloque}>Bloque +</p>
                    </div>
                  )}
                </Droppable>
              </>
            )}
          </div>

          <aside className={styles.codigoWrap}>
            <h1 className={styles.h1}>CÓDIGO</h1>
            <p>{generatedCode.current}</p>
          </aside>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Proyecto;
