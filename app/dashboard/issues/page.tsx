import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const sampleIssues = [
  { id: "1", title: "Update homepage hero section", status: "open", priority: "high", assignee: "Alice" },
  { id: "2", title: "Fix mobile navigation bug", status: "in_progress", priority: "urgent", assignee: "Bob" },
  { id: "3", title: "Add contact form validation", status: "closed", priority: "medium", assignee: "Charlie" },
];

export default async function IssuesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/page");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
        <div className="text-sm text-muted-foreground">
          Logged in as {session.user.email}
        </div>
      </div>
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Priority</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sampleIssues.map((issue) => (
              <tr key={issue.id}>
                <td className="px-4 py-3 text-sm">{issue.title}</td>
                <td className="px-4 py-3 text-sm capitalize">{issue.status.replace("_", " ")}</td>
                <td className="px-4 py-3 text-sm capitalize">{issue.priority}</td>
                <td className="px-4 py-3 text-sm">{issue.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}