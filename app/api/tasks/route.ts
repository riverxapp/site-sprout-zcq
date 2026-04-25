import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { TaskStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as TaskStatus | null;
  const assigneeId = searchParams.get('assigneeId');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  let tasks = db.tasks.getAll();

  if (status) {
    tasks = tasks.filter(task => task.status === status);
  }

  if (assigneeId) {
    tasks = tasks.filter(task => task.assigneeId === assigneeId);
  }

  const total = tasks.length;
  const skip = (page - 1) * limit;
  const paginatedTasks = tasks.slice(skip, skip + limit);

  return NextResponse.json({
    tasks: paginatedTasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, dueDate, status, priority, assigneeId, relatedTo } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    const task = db.tasks.create({
      title,
      description: description || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      status: status || 'pending',
      priority: priority || 'medium',
      assigneeId: assigneeId || null,
      createdById: session.user.id,
      relatedTo: relatedTo || null,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

const tasksStore: Task[] = [];
let taskIdCounter = 1;

function getAllTasks() {
  return [...tasksStore];
}

function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: String(taskIdCounter++),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  tasksStore.push(task);
  return task;
}

export const tasks = {
  getAll: getAllTasks,
  create: createTask,
};

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: TaskStatus;
  priority: string;
  assigneeId: string | null;
  createdById: string;
  relatedTo: string | null;
  createdAt: string;
  updatedAt: string;
}