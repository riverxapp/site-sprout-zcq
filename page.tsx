"use client";

import { useEffect, useState } from "react";
import DashboardCards from "@/app/(dashboard)/components/dashboard-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalCustomers: number;
  totalLeads: number;
  totalDeals: number;
  totalTasks: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data: Stats) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Activity className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No data yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start by adding customers, leads, deals, or tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your CRM activity.
        </p>
      </div>
      <DashboardCards stats={stats} />
    </div>
  );
}