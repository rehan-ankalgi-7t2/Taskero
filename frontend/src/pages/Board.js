import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Board = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);

  useEffect(() => {
    // dispatch(loadTasks());
  }, [dispatch]);

  const onDragEnd = (result) => {
    // if (!result.destination) return;
    // const { source, destination } = result;
    // dispatch(moveTask({ taskId: result.draggableId, newColumn: destination.droppableId }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '24px' }}>
        {['Todo', 'In Progress', 'Completed '].map((column) => (
          <Droppable droppableId={column} key={column}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ margin: '8px', padding: '8px', width: '300px', backgroundColor: '#f0f0f0' }}
              >
                <h4>{column}</h4>
                {tasks.filter(task => task.column === column).map((task, index) => (
                  <Draggable draggableId={task.id} index={index} key={task.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ padding: '16px', margin: '8px 0', backgroundColor: '#fff', ...provided.draggableProps.style }}
                      >
                        {task.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
