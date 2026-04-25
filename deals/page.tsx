import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const columns = [
  { title: "Prospecting", key: "prospecting", color: "bg-blue-100 text-blue-800" },
 { title: "Negotiation", key: "negotiation", color: "bg-yellow-100 text-yellow-800" },
 { title: "Closed Won", key: "closed_won", color: "bg-green-100 text-green-800" },
 { title: "Closed Lost", key: "closed_lost", color: "bg-red-100 text-red-800" },
];

const sampleDeals = [
  { id: "1", title: "ACME Corp Partnership", value: 50000, company: "ACME Corp", stage: "prospecting" },
  { id: "2", title: "Globex Expansion", value: 75000, company: "Globex Inc.", stage: "prospecting" },
  { id: "3", title: "Initech Renewal", value: 30000, company: "Initech", stage: "negotiation" },
  { id: "4", title: "Hooli Enterprise", value: 120000, company: "Hooli", stage: "negotiation" },
  { id: "5", title: "Umbrella Corp Deal", value: 90000, company: "Umbrella Corp", stage: "closed_won" },
  { id: "6", title: "Wonka Industries", value: 45000, company: "Wonka Industries", stage: "closed_won" },
  { id: "7", title: "Stark Industries", value: 20000, company: "Stark Industries", stage: "closed_lost" },
  { id: "8", title: "Oscorp Failed Lead", value: 10000, company: "Oscorp", stage: "closed_lost" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function DealCard({ deal }: { deal: { id: string; title: string; value: number; company: string; stage: string } }) {
  const stageColors: Record<string, string> = {
    prospecting: "bg-blue-100 text-blue-800",
    negotiation: "bg-yellow-100 text-yellow-800",
    closed_won: "bg-green-100 text-green-800",
    closed_lost: "bg-red-100 text-red-800",
  };

  return (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-medium">{deal.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <p className="text-xs text-muted-foreground">{deal.company}</p>
        <p className="text-sm font-semibold mt-1">{formatCurrency(deal.value)}</p>
        <Badge className={`mt-2 ${stageColors[deal.stage] || "bg-gray-100 text-gray-800"}`}>
          {deal.stage.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </Badge>
      </CardContent>
    </Card>
  );
}

export default function DealsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Deal Pipeline</h1>
        <p className="text-muted-foreground">Track deals from prospecting to closed won/lost.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const dealsInColumn = sampleDeals.filter((d) => d.stage === column.key);
          const totalValue = dealsInColumn.reduce((sum, d) => sum + d.value, 0);
          return (
            <div key={column.key}>
              <Card className="bg-muted/50">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
                    <Badge variant="outline" className={column.color}>{dealsInColumn.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    Total: {formatCurrency(totalValue)}
                  </p>
                  {dealsInColumn.map((deal) => <DealCard key={deal.id} deal={deal} />)}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
