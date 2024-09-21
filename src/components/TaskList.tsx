'use client';

import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import { TaskDocument } from '@/models/Task';

const TaskList: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [editingTask, setEditingTask] = useState<TaskDocument | null>(null);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'All' || task.status === statusFilter) &&
    (priorityFilter === 'All' || task.priority === priorityFilter)
  );

  const handleEditTask = (task: TaskDocument) => {
    setEditingTask(task);
  };

  const handleSubmitTask = (taskData: Partial<TaskDocument>) => {
    if (editingTask && editingTask._id) {
      updateTask(editingTask._id.toString(), taskData);
    } else {
      // Assuming you have a way to get the current user's ID
      const userId = 'current-user-id'; // Replace this with actual user ID
      addTask({ ...taskData, userId } as TaskDocument);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Task List</h1>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setEditingTask({} as TaskDocument)}>Add New Task</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => (
          <TaskCard
            key={task._id.toString()}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <TaskForm
            task={editingTask._id ? editingTask : undefined}
            onSubmit={handleSubmitTask}
            onCancel={() => setEditingTask(null)}
          />
        </div>
      )}
    </div>
  );
};

export default TaskList;