import { Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "@/lib/toast";
import { useLogout } from "@/features/auth/auth-query";

export default function AppLayoutPage() {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    logout();
    await navigate({ to: "/login" });
    await toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Project Tracker</h1>
          <p className="text-sm text-gray-500">
            Manage your projects and tasks
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </header>

      <main className="mx-auto max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
