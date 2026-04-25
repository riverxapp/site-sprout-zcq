"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TaskListItemProps {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  assignee?: { name: string; avatarUrl?: string };
  onToggle?: (id: string, completed: boolean) => void;
}

export function TaskListItem({
  id,
  title,
  status,
  priority,
  dueDate,
  assignee,
  onToggle,
}: TaskListItemProps) {
  const [checked, setChecked] = useState(status === "done");

  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onToggle?.(id, newChecked);
  };

  const priorityColorMap: Record<string, string> = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex items-center justify-between py-2 px-4 border-b">
      <div className="flex items-center gap-3">
        <Checkbox checked={checked} onCheckedChange={handleToggle} />
        <span className={cn("text-sm", checked && "line-through text-muted-foreground")}>{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={cn("text-xs font-medium", priorityColorMap[priority])}>{priority}</Badge>
        {dueDate && <span className="text-xs text-muted-foreground">{dueDate}</span>}
        {assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
            <AvatarFallback className="text-xs">{assignee.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
