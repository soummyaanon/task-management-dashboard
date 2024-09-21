'use client';

import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ITask } from '@/models/Task';

interface TaskCardProps {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>
        <p className="text-sm">Status: {task.status}</p>
        <p className="text-sm">Priority: {task.priority}</p>
        {task.dueDate && (
          <p className="text-sm">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => onEdit(task)} className="mr-2">Edit</Button>
        <Button onClick={() => onDelete(task._id.toString())} variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;