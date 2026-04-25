import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { entityType, entityId, content } = body;

  if (!entityType || !entityId || !content) {
    return NextResponse.json(
      { error: "entityType, entityId, and content are required" },
      { status: 400 }
    );
  }

  const validEntityTypes = ["customer", "lead", "deal", "task"];
  if (!validEntityTypes.includes(entityType)) {
    return NextResponse.json(
      {
        error: `Invalid entityType. Must be one of: ${validEntityTypes.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const note = db.createNote({
    entityType,
    entityId,
    content,
    authorId: session.user.id,
  });

  return NextResponse.json(note, { status: 201 });
}

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType");
  const entityId = searchParams.get("entityId");

  if (!entityType || !entityId) {
    return NextResponse.json(
      { error: "entityType and entityId query parameters are required" },
      { status: 400 }
    );
  }

  const validEntityTypes = ["customer", "lead", "deal", "task"];
  if (!validEntityTypes.includes(entityType)) {
    return NextResponse.json(
      {
        error: `Invalid entityType. Must be one of: ${validEntityTypes.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const notes = db.getNotesByEntity(entityType, entityId);
  return NextResponse.json(notes);
}
