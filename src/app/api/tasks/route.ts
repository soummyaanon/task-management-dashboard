import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Task, ITask } from '@/models/Task';
import { verifyToken, getAuthCookie } from '@/lib/auth';

export async function GET(req: Request) {
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

export async function PUT(req: Request) {
  try {
    const token = getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id, title, description, status, priority, dueDate } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const task = await Task.findOne({ _id: id, userId: payload.userId });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update task fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) {
      if (!['To Do', 'In Progress', 'Completed'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      task.status = status;
    }
    if (priority) {
      if (!['Low', 'Medium', 'High'].includes(priority)) {
        return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
      }
      task.priority = priority;
    }
    if (dueDate) task.dueDate = new Date(dueDate);

    await task.save();

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const result = await Task.deleteOne({ _id: id, userId: payload.userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}