import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Task } from '@/models/Task';
import { verifyToken, getAuthCookie } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = params;

    await connectToDatabase();
    const task = await Task.findOne({ _id: id, userId: payload.userId });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = params;
    const { title, description, status, priority, dueDate } = await req.json();

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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthCookie();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = params;

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