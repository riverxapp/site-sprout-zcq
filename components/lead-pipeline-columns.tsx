import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/types";

interface PipelineColumnProps {
  title: string;
  deals: Deal[];
  totalValue: number;
  color?: string;
  onDealClick?: (deal: Deal) => void;
}

function PipelineColumn({ title, deals, totalValue, color, onDealClick }: PipelineColumnProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={cn("h-3 w-3 rounded-full", color)} />
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
            {deals.length}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          ${totalValue.toLocaleString()}
        </span>
      </div>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="flex flex-col gap-3 pr-3">
          {deals.length === 0 && (
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-sm text-muted-foreground">
              No deals yet
            </div>
          )}
          {deals.map((deal) => (
            <Card
              key={deal.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => onDealClick?.(deal)}
            >
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm font-medium leading-tight">
                  {deal.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{deal.customerName || "Unknown"}</span>
                  <span className="font-semibold">
                    ${deal.value?.toLocaleString() || "0"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface LeadPipelineColumnsProps {
  columns: {
    title: string;
    deals: Deal[];
    totalValue: number;
    color?: string;
  }[];
  onDealClick?: (deal: Deal) => void;
}

export function LeadPipelineColumns({ columns, onDealClick }: LeadPipelineColumnsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {columns.map((column) => (
        <PipelineColumn key={column.title} {...column} onDealClick={onDealClick} />
      ))}
    </div>
  );
}