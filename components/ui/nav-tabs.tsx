"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const NavTabsContext = React.createContext<{
  pathname: string
  basePath?: string
}>({
  pathname: "",
  basePath: "",
})

interface NavTabsProps {
  children: React.ReactNode
  basePath?: string
  className?: string
}

function NavTabs({ children, basePath = "", className }: NavTabsProps) {
  const pathname = usePathname()
  
  return (
    <NavTabsContext.Provider value={{ pathname, basePath }}>
      <div className={cn("flex flex-col gap-2", className)}>
        {children}
      </div>
    </NavTabsContext.Provider>
  )
}

interface NavTabsListProps {
  children: React.ReactNode
  className?: string
}

function NavTabsList({ children, className }: NavTabsListProps) {
  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

interface NavTabsTriggerProps {
  children: React.ReactNode
  value: string
  href?: string
  className?: string
  icon?: React.ReactNode
  preserveQueryParams?: boolean
  disabled?: boolean
  scroll?: boolean
  matchSeason?: boolean
}

function NavTabsTrigger({ children, value, href, className, icon, preserveQueryParams = false, disabled = false, scroll = true, matchSeason = false }: NavTabsTriggerProps) {
  const { 
    pathname, 
    // basePath 
  } = React.useContext(NavTabsContext)


  const searchParams = useSearchParams()

  const pathnameWithoutLastSegment = pathname.split('/').slice(0, -1).join('/');

  let linkHref = pathnameWithoutLastSegment + `/${value}`
  
  const isActive = matchSeason ? pathname.match(new RegExp(`${pathnameWithoutLastSegment}/\\d{4}$`)) !== null : pathname === linkHref

  if (preserveQueryParams) {
    const currentParams = searchParams.toString()
    if (currentParams) {
      linkHref += `?${currentParams}`
    }
  }

  return (
    <Link
      href={linkHref}
      className={cn(
        "data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
        disabled ? "pointer-events-none opacity-50" : "",
        className
      )}
      data-state={isActive ? "active" : "inactive"}
      aria-selected={isActive}
      role="tab"
      scroll={scroll}
    >
      {icon}
      {children}
    </Link>
  )
}

export { NavTabs, NavTabsList, NavTabsTrigger }

