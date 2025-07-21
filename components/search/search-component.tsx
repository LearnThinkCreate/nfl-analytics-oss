"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import SearchDialog from "./search-dialog"
import SearchResults from "./search-results"
import { cn } from "@/lib/utils"
import { useSearch } from "@/lib/hooks/use-search"

interface SearchComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    dialogClassName?: string
    resultsClassName?: string
    inputClassName?: string
  }
  
  export default function SearchComponent({
    className,
    dialogClassName,
    resultsClassName,
    inputClassName,
    ...props
  }: SearchComponentProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
  
    const { searchQuery, results, error, showLoading, updateSearchQuery, resetSearchQuery } = useSearch()
  
    // Handle keyboard shortcut
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Check for Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault()
          setIsDialogOpen(true)
        }
      }
  
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])
  
    // Close dialog and reset search when dialog closes
    const handleDialogClose = useCallback(() => {
      setIsDialogOpen(false)
      if (!isFocused) {
        resetSearchQuery()
      }
    }, [isFocused, resetSearchQuery])
  
    return (
      <div className={cn("relative w-full", className)} {...props}>
        <div className="group relative">
          <div
            className={cn(
              "absolute inset-0 rounded-md bg-linear-to-r/oklch from-(--color-indigo-400) to-(--color-indigo-500) opacity-0 blur-xs transition-opacity duration-200",
              isFocused && "opacity-10"
            )}
            aria-hidden="true"
          />
          <div className="relative flex items-center">
            <Search
              className={cn(
                "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200",
                isFocused && "text-foreground"
              )}
            />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search Players..."
              value={searchQuery}
              onChange={(e) => updateSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className={cn(
                "w-full pl-10 transition-all duration-200 border-(--color-muted-foreground/20)",
                isFocused ? "border-(--color-indigo-400/40) shadow-xs" : "hover:border-(--color-muted-foreground/30)",
                inputClassName
              )}
              aria-label="Search"
            />
            <kbd
              className={cn(
                `
                pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none 
                rounded border bg-muted px-1.5 py-0.5 text-[10px] 
                font-medium text-muted-foreground opacity-100 transition-opacity duration-200
                hidden md:block
                `,
                isFocused && "opacity-70"
              )}
            >
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
  
        {/* Inline search results */}
        {isFocused && searchQuery && (
          <div className="absolute z-10 w-full mt-1 animate-in fade-in-0 zoom-in-95 duration-200 bg-background border rounded-md shadow-md overflow-hidden max-h-[50vh] sm:max-h-[400px] overflow-y-auto left-0 right-0 sm:left-auto sm:right-auto">
            <h3 className="text-sm font-medium text-muted-foreground px-3 py-2 border-b sticky top-0 bg-background/95 backdrop-blur-sm">Search Results</h3>
            <SearchResults
              results={results}
              query={searchQuery}
              isLoading={showLoading}
              error={error}
              className={resultsClassName}
              cardClassName="rounded-none shadow-none border-0"
            />
          </div>
        )}
  
        {/* Dialog for keyboard shortcut */}
        {isDialogOpen && (
          <SearchDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSearch={updateSearchQuery}
          initialQuery={searchQuery}
          results={results}
          // topResults={topResults}
          isLoading={showLoading}
          error={error}
          contentClassName={dialogClassName}
          resultsClassName={resultsClassName}
        />
        )}
      </div>
    )
  }
  