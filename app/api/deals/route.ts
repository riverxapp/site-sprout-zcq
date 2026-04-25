import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let deals = db.deals.getAll();

    if (stage) {
      deals = deals.filter((deal) => deal.stage === stage);
    }

    const total = deals.length;
    const start = (page - 1) * limit;
    const paginatedDeals = deals.slice(start, start + limit);

    return NextResponse.json({
      deals: paginatedDeals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/deals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, value, stage, customerId, closeDate, notes } = body;

    if (!title || !value || !stage) {
      return NextResponse.json(
        { error: 'Missing required fields: title, value, stage' },
        { status: 400 }
      );
    }

    const deal = db.deals.create({
      title,
      value,
      stage,
      customerId: customerId || null,
      closeDate: closeDate ? new Date(closeDate) : null,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Log activity
    db.activityLogs.create({
      action: 'create',
      entityType: 'deal',
      entityId: deal.id,
      userId: session.user.id,
      timestamp: new Date(),
      details: `Deal "${title}" created with value ${value} and stage ${stage}`,
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error('POST /api/deals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}