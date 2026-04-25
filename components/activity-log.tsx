"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "create" | "update" | "delete";
  entityType: "customer" | "lead" | "deal" | "task";
  entityId: string;
  description: string;
  createdAt: string;
}

interface ActivityLogProps {
  limit?: number;
  className?: string;
}

export function ActivityLog({ limit = 10, className }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch("/api/activity-log?limit=" + limit);
        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();
        setActivities(data.activities ?? []);
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, [limit]);

  const typeColor = (type: Activity["type"]) => {
    switch (type) {
      case "create":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const entityIcon = (entityType: Activity["entityType"]) => {
    switch (entityType) {
      case "customer":
        return "👤";
      case "lead":
        return "📧";
      case "deal":
        return "💰";
      case "task":
        return "✅";
      default:
        return "📌";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>No recent activity</p>
              <p className="text-sm">Actions will appear here as you use the CRM</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-lg leading-none mt-0.5" aria-hidden="true">
                    {entityIcon(activity.entityType)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Badge variant="outline" className={typeColor(activity.type)}>
                    {activity.type}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
