// src/components/KanbanBoard.tsx
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { TaskDocument } from '@/models/Task';

interface KanbanBoardProps {
  tasks: TaskDocument[];
  updateTask: (id: string, updates: Partial<TaskDocument>) => Promise<void>;
}

const statuses = ['To Do', 'In Progress', 'Completed'];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, updateTask }) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      updateTask(draggableId, { status: destination.droppableId as 'To Do' | 'In Progress' | 'Completed' });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4">
        {statuses.map((status) => (
          <div key={status} className="bg-gray-100 p-4 rounded-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">{status}</h2>
            <Droppable droppableId={status}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task, index) => (
                      <Draggable key={task._id.toString()} draggableId={task._id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 mb-2 rounded shadow"
                          >
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;