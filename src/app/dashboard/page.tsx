import TaskList from '@/components/TaskList'
import TaskForm from '@/components/TaskForm'

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
      <TaskForm 
        onSubmit={(task) => console.log('Task submitted:', task)} 
        onCancel={() => console.log('Task form cancelled')} 
      />
      <TaskList />
    </div>
  )
}