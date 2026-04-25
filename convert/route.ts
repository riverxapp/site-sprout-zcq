import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getLeadById, deleteLead, updateLead } from "@/lib/db";
import { createCustomer } from "@/lib/db";
import { getStats, incrementStat } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lead = getLeadById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { name, email, phone, company, notes } = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      notes: body.notes || lead.notes || "",
    };

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required to convert lead to customer" },
        { status: 400 }
      );
    }

    const customer = createCustomer({
      name,
      email,
      phone,
      company,
      notes,
      stage: "lead",
      source: lead.source || "converted",
    });

    const updatedLead = updateLead(params.id, { status: "converted" });

    const stats = getStats();
    incrementStat("totalCustomers");

    return NextResponse.json(
      {
        customer,
        lead: updatedLead,
        message: "Lead converted to customer successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error converting lead to customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
