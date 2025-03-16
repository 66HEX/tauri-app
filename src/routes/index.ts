import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/dashboard'
import { ClientsPage } from '@/pages/clients'
import { PlansPage } from '@/pages/plans'
import { PlansAddPage } from '@/pages/plans/add'
import { PlansListPage } from '@/pages/plans/list'
import { PlansArchivePage } from '@/pages/plans/archive'
import { SchedulePage } from '@/pages/schedule'
import { ChatPage } from '@/pages/chat'
import { SupportPage } from '@/pages/support'
import { FeedbackPage } from '@/pages/feedback'
import { AccountPage } from '@/pages/account'
import { BillingPage } from '@/pages/billing'
import { NotificationsPage } from '@/pages/notifications'

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

const plansAddRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans/add',
  component: PlansAddPage,
})

const plansListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans/list',
  component: PlansListPage,
})

const plansArchiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans/archive',
  component: PlansArchivePage,
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

// Create the router with all routes
export const routeTree = rootRoute.addChildren([
  dashboardRoute,
  clientsRoute,
  plansRoute,
  plansAddRoute,
  plansListRoute,
  plansArchiveRoute,
  scheduleRoute,
  chatRoute,
  supportRoute,
  feedbackRoute,
  accountRoute,
  billingRoute,
  notificationsRoute,
])

export const router = createRouter({ routeTree })

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}