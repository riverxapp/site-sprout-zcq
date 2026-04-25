import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TaskList } from "@/app/(dashboard)/components/task-list-item";

export default async function TasksPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const tasks = await db.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <a
          href="/tasks/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Add Task
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href="/tasks?status=all"
          className="rounded-md border px-3 py-1 text-sm"
        >
          All
        </a>
        <a
          href="/tasks?status=pending"
          className="rounded-md border px-3 py-1 text-sm"
        >
          Pending
        </a>
        <a
          href="/tasks?status=in-progress"
          className="rounded-md border px-3 py-1 text-sm"
        >
          In Progress
        </a>
        <a
          href="/tasks?status=done"
          className="rounded-md border px-3 py-1 text-sm"
        >
          Done
        </a>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            No tasks yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first task to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task: any) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-md border bg-card p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <form
                  action={async () => {
                    "use server";
                    const newStatus =
                      task.status === "done" ? "pending" : "done";
                    await db.task.update({
                      where: { id: task.id },
                      data: { status: newStatus },
                    });
                    redirect("/tasks");
                  }}
                >
                  <button
                    type="submit"
                    className={`h-5 w-5 rounded border ${
                      task.status === "done"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {task.status === "done" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-primary-foreground"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </form>
                <div>
                  <p
                    className={`font-medium ${
                      task.status === "done" ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {task.assignee ? `Assigned to ${task.assignee}` : "Unassigned"}
                    {task.dueDate && ` · Due ${new Date(task.dueDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  task.status === "done"
                    ? "bg-green-100 text-green-800"
                    : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
