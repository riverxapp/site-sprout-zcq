import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  let leads = await db.leads.getAll();

  if (search) {
    const q = search.toLowerCase();
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q)
    );
  }
  if (status) {
    leads = leads.filter((l) => l.status === status);
  }
  if (source) {
    leads = leads.filter((l) => l.source === source);
  }

  const total = leads.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedLeads = leads.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedLeads,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, source, notes, company } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const newLead = await db.leads.create({
      name,
      email,
      phone: phone || "",
      source: source || "manual",
      notes: notes || "",
      company: company || "",
      status: "New",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ data: newLead }, { status: 201 });
  } catch (error) {
    console.error("Failed to create lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
