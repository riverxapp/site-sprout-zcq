```tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { UserDropdown } from "@/components/user-dropdown";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronRight, Home } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Customers",
  leads: "Leads",
  deals: "Deals",
  tasks: "Tasks",
  settings: "Settings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  if (!isMounted) {
    return null;
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "Home", href: "/dashboard" },
    ...pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, href };
    }),
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden border-r bg-card lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-14 items-center border-b px-6 font-semibold">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span>CRM</span>
          </Link>
        </div>
        <Sidebar />
      </aside>

      {/* Mobile navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-3 z-40 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center border-b px-6 font-semibold">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              <span>CRM</span>
            </Link>
          </div>
          <MobileNav />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                <Link
                  href={crumb.href}
                  className={`hover:text-foreground ${
                    index === breadcrumbs.length - 1
                      ? "font-medium text-foreground"
                      : ""
                  }`}
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>

          {/* User dropdown */}
          <UserDropdown />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
```