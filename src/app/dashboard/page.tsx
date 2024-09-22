'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTaskContext } from '@/context/TaskContext';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, List, BarChart2, Layout } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';
import { TaskDocument } from '@/models/Task';

export default function DashboardPage() {
  const { user, checkLoginStatus } = useAuth();
  const { tasks, addTask, updateTask } = useTaskContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkLoginStatus();
      if (!user) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };
    init();
  }, [checkLoginStatus, router, user]);

  const handleSubmit = (task: Partial<TaskDocument>) => {
    addTask(task as TaskDocument);
    setShowTaskForm(false);
  };

  const handleCancel = () => {
    setShowTaskForm(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <Button onClick={() => setShowTaskForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      {showTaskForm && (
        <Card className="p-4">
          <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </Card>
      )}

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" /> List View
          </TabsTrigger>
          <TabsTrigger value="kanban">
            <Layout className="mr-2 h-4 w-4" /> Kanban View
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart2 className="mr-2 h-4 w-4" /> Statistics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card className="p-4">
            <TaskList tasks={tasks} />
          </Card>
        </TabsContent>
        <TabsContent value="kanban">
          <Card className="p-4">
            <KanbanBoard tasks={tasks} updateTask={updateTask} />
          </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
            <p>Total Tasks: {tasks.length}</p>
            <p>Completed Tasks: {tasks.filter(task => task.status === 'Completed').length}</p>
            <p>Pending Tasks: {tasks.filter(task => task.status === 'To Do').length}</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}