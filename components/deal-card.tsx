import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Deals } from "@/lib/types";

interface DealCardProps {
  deal: Deals;
}

export function DealCard({ deal }: DealCardProps) {
  const stageColors: Record<string, string> = {
    Prospecting: "bg-blue-100 text-blue-800",
    Negotiation: "bg-yellow-100 text-yellow-800",
    "Closed Won": "bg-green-100 text-green-800",
    "Closed Lost": "bg-red-100 text-red-800",
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm truncate flex-1">{deal.title}</h3>
          {deal.customerName && (
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {deal.customerName}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-medium">{formatCurrency(deal.value)}</span>
          <Badge
            className={`text-xs px-2 py-0.5 rounded-full ${
              stageColors[deal.stage] || "bg-gray-100 text-gray-800"
            }`}
          >
            {deal.stage}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function DealCardSkeleton() {
  return (
    <Card className="mb-3 animate-pulse">
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-5 bg-gray-200 rounded w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}
