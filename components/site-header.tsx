"use client"

import { SidebarIcon } from "lucide-react"
// import Link from "next/link"

import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
// import { ModeToggle } from "@/components/mode-toggle"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SearchComponent from "@/components/search/search-component"
export function SiteHeader({ children }: { children?: React.ReactNode }) {
  const { toggleSidebar } = useSidebar()

  return (
    <header
      data-slot="site-header"
      className="bg-background sticky top-0 z-50 flex w-full items-center border-b"
    >
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2 pr-4">
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="has-[>svg]:px-2"
            aria-label="Toggle Sidebar"
          >
            <SidebarIcon />
          </Button>
        </div>
        {children}
        <div className="ml-auto flex w-full flex-1 items-center justify-end gap-2">
          <SearchComponent className="w-full md:max-w-96" />
        </div>
      </div>
    </header>
  )
}