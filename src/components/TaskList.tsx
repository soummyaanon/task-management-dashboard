// src/components/TaskList.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import { TaskDocument } from '@/models/Task';
import { Plus, } from 'lucide-react';

interface TaskListProps {
  tasks: TaskDocument[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { addTask, updateTask, deleteTask } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [editingTask, setEditingTask] = useState<TaskDocument | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'All' || task.status === statusFilter) &&
      (priorityFilter === 'All' || task.priority === priorityFilter)
    );
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const handleEditTask = useCallback((task: TaskDocument) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  }, []);

  const handleSubmitTask = useCallback((taskData: Partial<TaskDocument>) => {
    if (editingTask && editingTask._id) {
      updateTask(editingTask._id.toString(), taskData);
    } else {
      // In a real application, you would get the user ID from an auth context or similar
      const userId = 'current-user-id';
      addTask({ ...taskData, userId } as TaskDocument);
    }
    setEditingTask(null);
    setIsDialogOpen(false);
  }, [editingTask, updateTask, addTask]);

  const handleDeleteTask = useCallback((id: string) => {
    deleteTask(id);
  }, [deleteTask]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handlePriorityFilterChange = useCallback((value: string) => {
    setPriorityFilter(value);
  }, []);

  const handleAddNewTask = useCallback(() => {
    setEditingTask(null);
    setIsDialogOpen(true);
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-5">Task List</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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
          <Select value={priorityFilter} onValueChange={handlePriorityFilterChange}>
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
          <Button onClick={handleAddNewTask}>
            <Plus className="h-4 w-4 mr-2" /> Add New Task
          </Button>
        </div>
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found. Try adjusting your filters or add a new task.</p>
        ) : (
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
        )}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask?._id ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            </DialogHeader>
            <TaskForm
              task={editingTask || undefined}
              onSubmit={handleSubmitTask}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TaskList;