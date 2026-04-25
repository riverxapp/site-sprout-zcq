import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customers = db.getCustomers();
    const leads = db.getLeads();
    const deals = db.getDeals();
    const tasks = db.getTasks();

    const dealsByStage = {
      prospecting: deals.filter((d: any) => d.stage === "prospecting").length,
      negotiation: deals.filter((d: any) => d.stage === "negotiation").length,
      closed_won: deals.filter((d: any) => d.stage === "closed_won").length,
      closed_lost: deals.filter((d: any) => d.stage === "closed_lost").length,
    };

    const tasksByStatus = {
      pending: tasks.filter((t: any) => t.status === "pending").length,
      in_progress: tasks.filter((t: any) => t.status === "in_progress").length,
      done: tasks.filter((t: any) => t.status === "done").length,
    };

    return NextResponse.json({
      totalCustomers: customers.length,
      totalLeads: leads.length,
      dealsByStage,
      tasksByStatus,
      recentActivityCount: 0,
    });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
