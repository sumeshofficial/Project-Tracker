import { sessionQueryOptions } from "@/features/auth/auth-query";
import { queryClient } from "@/lib/query-client";
import AppLayoutPage from "@/routes/app-layout-page";
import LoginPage from "@/routes/login-page";
import ProjectsPage from "@/routes/projects-page";
import RegisterPage from "@/routes/register-page";
import NewProjectPage from "@/routes/new-project-page";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import TasksPage from "@/routes/tasks-page";

interface RouterContext {
  queryClient: typeof queryClient;
}

const requireAuth = async () => {
  const session = await queryClient.fetchQuery(sessionQueryOptions());

  if (!session) {
    throw redirect({ to: "/login" });
  }
};

const redirectWhenAuthenticated = async () => {
  const session = await queryClient.fetchQuery(sessionQueryOptions());
  if (session) {
    throw redirect({ to: "/" });
  }
};

const rootRoute = createRootRoute<RouterContext>({
  component: () => <Outlet />,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: redirectWhenAuthenticated,
  component: RegisterPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: redirectWhenAuthenticated,
  component: LoginPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    const session = await queryClient.fetchQuery(sessionQueryOptions());
    if (!session) {
      throw redirect({ to: "/login" });
    }
    throw redirect({ to: "/app/projects" });
  },
  component: () => null,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  beforeLoad: requireAuth,
  component: AppLayoutPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "projects",
  beforeLoad: requireAuth,
  component: ProjectsPage,
});

const newProjectRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "projects/new",
  beforeLoad: requireAuth,
  component: NewProjectPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => projectsRoute,
  path: "tasks",
  beforeLoad: requireAuth,
  component: TasksPage,
});


const routeTree = rootRoute.addChildren([
  registerRoute,
  loginRoute,
  homeRoute,
  appRoute.addChildren([
    projectsRoute,
    newProjectRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
