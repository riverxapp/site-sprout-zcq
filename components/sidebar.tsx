"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Banknote,
  ClipboardList,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Leads",
    href: "/dashboard/leads",
    icon: TrendingUp,
  },
  {
    title: "Deals",
    href: "/dashboard/deals",
    icon: Banknote,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: ClipboardList,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        <span
          className={cn(
            "text-lg font-semibold tracking-tight",
            collapsed && "hidden"
          )}
        >
          CRM
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 hover:bg-accent"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon size={18} />
              <span className={cn(collapsed && "hidden")}>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
