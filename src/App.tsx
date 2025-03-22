import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { RouterProvider, Outlet, useLocation, Link } from '@tanstack/react-router'
import { router } from "@/routes"
import { AuthProvider, useAuth } from "@/lib/auth-context"

function AppContent() {
  const location = useLocation()
  const pathname = location.pathname
  const { isLoggedIn } = useAuth()
  const isAuthPage = pathname === '/login' || pathname === '/register'
  
  // Generate breadcrumb items based on the current path
  const generateBreadcrumbs = () => {
    // Skip empty segments and remove trailing slashes
    const segments = pathname.split('/').filter(segment => segment !== '')
    
    // Create breadcrumb items for each segment
    return segments.map((segment, index) => {
      // Create the path for this breadcrumb item
      const path = `/${segments.slice(0, index + 1).join('/')}`
      
      // Format the segment name to be more user-friendly
      const formattedName = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      // If this is the last segment, render it as the current page
      const isLastSegment = index === segments.length - 1
      
      return (
        <React.Fragment key={path}>
          {index > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem>
            {isLastSegment ? (
              <BreadcrumbPage>{formattedName}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={path}>{formattedName}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      )
    })
  }
  
  // If user is not logged in and on an auth page (login/register), show only the content without layout
  if (!isLoggedIn && isAuthPage) {
    return (
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    )
  }
  
  // For authenticated users or attempts to access protected routes while not logged in
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 max-h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/">Nexus App</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathname !== '/' && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    {generateBreadcrumbs()}
                  </>
                )}
                {pathname === '/' && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} defaultComponent={AppContent} />
    </AuthProvider>
  )
}
