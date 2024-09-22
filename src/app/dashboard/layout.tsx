'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </AuthProvider>
  );
}