import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Master</h1>
          <nav>
            <Link href="/login" passHref>
              <Button variant="secondary" className="mr-2">Login</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button variant="outline">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Welcome to Task Master</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage your tasks efficiently with our powerful dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Features</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Create, edit, and delete tasks</li>
              <li>Organize tasks with status and priority</li>
              <li>Filter and sort your task list</li>
              <li>Kanban board view for visual task management</li>
            </ul>
          </div>
          <div className="bg-card text-card-foreground rounded-lg p-6 shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Get Started</h3>
            <p className="mb-4">
              Sign up for an account to start managing your tasks today. Already have an account? Log in to access your dashboard.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/signup" passHref>
                <Button>Sign Up Now</Button>
              </Link>
              <Link href="/login" passHref>
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard" passHref>
            <Button size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </main>

      <footer className="bg-secondary text-secondary-foreground py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Task Master. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}