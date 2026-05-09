import { sessionQueryOptions } from "@/features/auth/auth-query";
import { queryClient } from "@/lib/query-client";
import HomePage from "@/routes/home-page";
import LoginPage from "@/routes/login-page";
import RegisterPage from "@/routes/register-page";
import { createRootRoute, createRoute, createRouter, Outlet, redirect } from "@tanstack/react-router";

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
    component: () => <Outlet />
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
    beforeLoad: requireAuth,
    component: HomePage
})

const routeTree = rootRoute.addChildren([
    registerRoute,
    loginRoute,
    homeRoute,
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