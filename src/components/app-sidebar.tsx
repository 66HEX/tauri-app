"use client"

import * as React from "react"
import {
  Command,
  LifeBuoy,
  Send,
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  MessageCircle,
} from "lucide-react"
import { Link } from '@tanstack/react-router'

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavTertiary } from "@/components/nav-tertiary"
import { NavQuaternary } from "@/components/nav-quaternary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ScrollArea } from "./ui/scroll-area"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: false,
    }
  ],
  navSecondary: [
    {
      title: "Clients",
      url: "/clients",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Add New Client",
          url: "/clients/add",
        },
        {
          title: "View All Clients",
          url: "/clients/list",
        },
        {
          title: "Archive",
          url: "/clients/archive",
        }
      ],
    },
    {
      title: "Plans",
      url: "/plans",
      icon: ClipboardList,
      isActive: false,
      items: [
        {
          title: "Add New Plan",
          url: "/plans/add",
        },
        {
          title: "View All Plans",
          url: "/plans/list",
        },
        {
          title: "Archive",
          url: "/plans/archive",
        }
      ],
    },
    {
      title: "Schedule",
      url: "/schedule",
      icon: Calendar,
      isActive: true,
    }
  ],
  navTertiary: [
    {
      title: "Chat",
      url: "/chat",
      icon: MessageCircle,
      isActive: true,
    }
  ],
  navQuaternary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nexus</span>
                  <span className="truncate text-xs opacity-50">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <NavMain items={data.navMain} />
          <NavSecondary items={data.navSecondary} />
          <NavTertiary items={data.navTertiary} />
          <NavQuaternary items={data.navQuaternary}/>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
