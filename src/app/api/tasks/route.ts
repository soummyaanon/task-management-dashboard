import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Task, ITask } from '@/models/Task';
import { verifyToken, getAuthCookie } from '@/lib/auth';

export async function GET() {
  try {
    const token = getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const tasks = await Task.find({ userId: payload.userId });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, description, status, priority, dueDate } = await req.json();

    // Validate required fields
    if (!title || !status || !priority) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate status and priority
    const validStatuses = ['To Do', 'In Progress', 'Completed'];
    const validPriorities = ['Low', 'Medium', 'High'];

    if (!validStatuses.includes(status) || !validPriorities.includes(priority)) {
      return NextResponse.json({ error: 'Invalid status or priority' }, { status: 400 });
    }

    await connectToDatabase();
    const task: ITask = new Task({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: payload.userId,
    });
    await task.save();

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}