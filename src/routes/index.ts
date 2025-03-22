import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/dashboard'
import { ClientsPage } from '@/pages/clients'
import { PlansPage } from '@/pages/plans'
import { SchedulePage } from '@/pages/schedule'
import { ChatPage } from '@/pages/chat'
import { SupportPage } from '@/pages/support'
import { FeedbackPage } from '@/pages/feedback'
import { AccountPage } from '@/pages/account'
import { BillingPage } from '@/pages/billing'
import { NotificationsPage } from '@/pages/notifications'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'

// Define the root route
const rootRoute = createRootRoute()

// Define routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
})

// Clients routes
const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  component: ClientsPage,
})

// Plans routes
const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans',
  component: PlansPage,
})

// Schedule route
const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/schedule',
  component: SchedulePage,
})

// Chat route
const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: ChatPage,
})

// Support route
const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support',
  component: SupportPage,
})

// Feedback route
const feedbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feedback',
  component: FeedbackPage,
})

// Account route
const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: AccountPage,
})

// Account route
const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing',
  component: BillingPage,
})

// Notifications route
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notifications',
  component: NotificationsPage,
})

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Register route
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

// Create the router with all routes
export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  clientsRoute,
  plansRoute,
  scheduleRoute,
  chatRoute,
  supportRoute,
  feedbackRoute,
  accountRoute,
  billingRoute,
  notificationsRoute,
  loginRoute,
  registerRoute,
])

export const router = createRouter({ routeTree })

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}