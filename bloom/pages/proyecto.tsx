import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Bloque from '../components/bloque';
import data from "../public/blocks.json";
import styles from '../styles/proyecto.module.scss';
import Image from 'next/image';
import homeSVG from '../public/home.svg';
import masSVG from '../public/mas.svg';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';

const Proyecto: React.FC = () => {
  const router = useRouter();
  const [canvasBlocks, setCanvasBlocks] = useState<any[]>([]);
  const [showCanvasElements, setShowCanvasElements] = useState(false);

  const handleClick = () => {
    router.push('/');
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === 'blocksList' && destination.droppableId === 'canvas') {
      const newBlock = { ...data[source.index], id: `canvas-${canvasBlocks.length}` };
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <button className={styles.home} onClick={handleClick}>
            <Image src={homeSVG} alt="home" width={24} height={24} />
          </button>
          <h1 className={styles.name}>Proyecto</h1>
          <button className={styles.export}>Exportar</button>
        </header>

        <div className={styles.container}>
          <aside className={styles.blocksAside}>
            <h1>CAPAS</h1>
            <Droppable droppableId="blocksList">
              {(provided: DroppableProvided) => (
                <div className={styles.blocksWrap} {...provided.droppableProps} ref={provided.innerRef}>
                  {data.map((bloque, index) => (
                    <Draggable key={bloque.visualName} draggableId={bloque.visualName} index={index}>
                      {(provided: DraggableProvided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Bloque name={bloque.visualName} exp={bloque.exp} isInBlockList={true} isInCanvas={false} />
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
            <div className={styles.dataSet}><h1>DataSet</h1></div>
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
                      {canvasBlocks.map((bloque, index) => (
                        <Draggable key={bloque.id} draggableId={bloque.id} index={index}>
                          {(provided: DraggableProvided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Bloque name={bloque.visualName} exp={bloque.exp} isInBlockList={false} isInCanvas={true} />
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
            <h1>CÓDIGO</h1>
          </aside>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Proyecto;