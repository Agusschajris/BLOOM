import React, {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import Bloque from '@components/block';
import data from "@public/blocks.json";
import styles from '@styles/proyecto.module.scss';
import Image from 'next/image';
import homeSVG from '@public/home.svg';
import masSVG from '@public/mas.svg';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult
} from 'react-beautiful-dnd';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import '/styles/prism-custom.css';
import {DatasetInfo, ProjectData} from "@/app/api/projects/[id]/route";
import {
  Argument,
  ArgValue,
  Block,
  BlockInstance,
  compressBlocks,
  DataBlock,
  decompressBlocks,
  StoredArgValue
} from "@lib/blockydata";

const Proyecto: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [canvasBlocks, setCanvasBlocks] = useState<BlockInstance[]>([]);
  const [showCanvasElements, setShowCanvasElements] = useState(false);

  let projectName = useRef<string>('');
  let generatedCode = useRef<string>('');
  let datasetInfo = useRef<DatasetInfo>();
  let datasetId = useRef<number>();
  generateCode();
  
  useEffect(() => {
    if (!id) return;

    fetch(`/api/projects/${id}`, {
      method: 'GET'
    }).then(response => {
      if (response.status !== 200)
        return handle404();

      response.json().then((project: ProjectData) => {
        projectName.current = project.name;
        datasetInfo.current = project.datasetInfo;
        datasetId.current = project.dataset!;
        setCanvasBlocks(decompressBlocks(project.blocks).map(getFrontendBlock));
      })
    });
  }, [id]);

  function handle404() {
    router.push("/_notFound").then();
  }
  
  const handleClick = () => {
    router.push('/dashboard').then();
  };
  
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination)
      return;
    
    if (source.droppableId === 'blocksList' && destination.droppableId === 'canvas') {
      const cloneBlock = structuredClone(data[source.index]) as Block;
      const newBlock = { ...cloneBlock, id: `canvas-${Date.now()}` } as BlockInstance;
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
  
  const handleSaveArgs = (index: number, newArgs: Argument[]) => setCanvasBlocks((prevBlocks) => {
    prevBlocks[index].args = newArgs;
    return [...prevBlocks];
  });

  function getBackendBlock(block: BlockInstance): DataBlock {
    const args = block.args.reduce((acc, arg) => {
      if (arg.value !== undefined && arg.value !== null) {
        acc[arg.argName] = arg.value as StoredArgValue;
      }
      return acc;
    }, {} as { [key: string]: StoredArgValue });
    
    return {
      id: Number(block.id.split("-")[1]),
      visualName: block.visualName,
      funName: block.funName,
      args
    };
  }
  
  function getFrontendBlock(dataBlock: DataBlock): BlockInstance {
    const blockReference = structuredClone(data.find((block) => block.funName === dataBlock.funName)) as Block;
    const rebuiltBlock = {...blockReference, id: `canvas-${dataBlock.id}`} as BlockInstance;
    rebuiltBlock.args.forEach((arg) => {
      arg.value = dataBlock.args[arg.argName] as ArgValue;
    });
    return rebuiltBlock;
  }
  
  function generateCode() {
    const blocks: DataBlock[] = canvasBlocks.map(getBackendBlock);
    if (blocks.length !== 0)
      blocks[0].args.inputShape = [datasetInfo.current!.features];
    let lastUnitSize = datasetInfo.current?.target;

    generatedCode.current = `import * as tf from "@tensorflow/tfjs";\n\nconst model = tf.sequential({\n  name: "${projectName.current}"\n});\n\n`;
    
    blocks.forEach((block) => {
      generatedCode.current += `model.add(tf.layers.${block.funName}(`; //${JSON.stringify(block.args, null, 2)}));\n`;
      if (Object.keys(block.args).length !== 0)
        generatedCode.current += JSON.stringify(block.args, null, 2);
      generatedCode.current += '));\n';
      if (block.args.units)
        lastUnitSize = block.args.units as number;
    });

    if (lastUnitSize !== datasetInfo.current?.target)
      generatedCode.current += `model.add(tf.layers.reshape({\n  "targetShape": [${datasetInfo.current?.target}]\n}));\n`;

    generatedCode.current += '\nmodel.compile({\n  optimizer: "sgd",\n  loss: "meanSquaredError",\n  metrics: ["accuracy"],\n});\n';
  }

  function exportModel() {
    fetch(`/api/export/${id}`, {
      method: 'GET',
    }).then(response => {
      if (!response.ok)
        return console.error("Failed to fetch model:", response);

      /*response.json().then((data) => {
        const { model, notebook } = data;
        console.log(model, notebook);
      });*/
    });
  }
  
  useEffect(generateCode, [projectName, canvasBlocks, id]);
  
  useEffect(() => {
    if (!id || !projectName.current) return
    
    const dataBlocks: DataBlock[] = canvasBlocks.map(getBackendBlock);
    const compressedBlocks = compressBlocks(dataBlocks);
    fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blocks: compressedBlocks }),
    }).then();
  }, [canvasBlocks, id]);
  useEffect(() => {
    Prism.highlightAll(); 
  }, [generatedCode]);
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <button className={styles.home} onClick={handleClick}>
            <Image src={homeSVG} alt="home" width={24} height={24} />
          </button>
          <h1 className={styles.name}>{projectName.current}</h1>
          <button className={styles.export} onClick={() => exportModel()}>Exportar</button>
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
                                onSave={(newArgs) => handleSaveArgs(index, newArgs)}
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
            <pre>
              <code className="language-python">{generatedCode.current}</code>
            </pre>
          </aside>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Proyecto;
