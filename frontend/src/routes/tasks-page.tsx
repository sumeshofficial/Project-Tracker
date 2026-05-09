import { Task } from "@/lib/types";

const dummyTasks: Task[] = [
  {
    id: "1",
    title: "Design dashboard UI",
    status: "TODO",
    dueDate: new Date("2026-05-12"),
  },
  {
    id: "2",
    title: "Implement authentication",
    status: "IN_PROGRESS",
    dueDate: new Date("2026-05-15"),
  },
  {
    id: "3",
    title: "Create task API",
    status: "DONE",
    dueDate: new Date("2026-05-10"),
  },
  {
    id: "4",
    title: "Add project settings page",
    status: "TODO",
    dueDate: new Date("2026-05-18"),
  },
];

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Tasks</h1>

        <div className="space-y-4">
          {dummyTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg bg-white p-4 shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{task.title}</h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Due Date: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium"
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}