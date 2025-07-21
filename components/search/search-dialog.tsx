"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SearchResults from "./search-results";
import type { PlayerSearchResult } from "@/types/player";
import { cn } from "@/lib/utils";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch search results")
  }
  return res.json()
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  initialQuery: string;
  results: PlayerSearchResult[];
  isLoading: boolean;
  error: Error | undefined;
  contentClassName?: string;
  resultsClassName?: string;
}

export default function SearchDialog({
  isOpen,
  onClose,
  onSearch,
  initialQuery,
  results,
  isLoading,
  error,
  contentClassName,
  resultsClassName,
}: SearchDialogProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  const { data: topResults, isLoading: isLoadingTop } = useSWR<PlayerSearchResult[]>(
    "/api/player/search?top=true&limit=5", 
    fetcher, 
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Update local query when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Handle input change
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  // Handle escape key press and focus input when dialog opens
  useEffect(() => {
    if (!isOpen) return;

    // Focus input when dialog opens
    const timer = setTimeout(() => {
      const input = document.querySelector(
        "[data-dialog-search-input]"
      ) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 50);

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "flex flex-col",
          `
          sm:max-w-[50vw] p-0 gap-0 border-none 
          bg-background/95 backdrop-blur-sm shadow-lg
          
          `,
          contentClassName
        )}
      >
        <DialogTitle className="sr-only">Search Players</DialogTitle>
        <div className="flex items-center p-4 px-4 relative border-b border-border/50">
          <div className="flex-1 relative">
            <Search
              className={cn(
                "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200",
                isFocused && "text-foreground"
              )}
            />
            <Input
              data-dialog-search-input
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type to search..."
              className={cn(
                "pl-10 pr-16 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                "text-base placeholder:text-muted-foreground/70"
              )}
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150 hover:bg-muted/80 focus:bg-muted/80 focus:outline-none rounded"
              aria-label="Close search dialog"
            >
              <kbd className="bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 rounded border border-border/50 font-medium">
                esc
              </kbd>
            </button>
          </div>
        </div>
        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
          <h3 className="text-sm font-medium text-muted-foreground px-3 py-2  border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            {query ? "Search Results" : "Top Players"}
          </h3>
          <SearchResults
            results={query ? results ?? [] : topResults ?? []}
            query={query ?? ""}
            isLoading={isLoading || isLoadingTop}
            error={error}
            showTopResults={!query}
            className={resultsClassName}
            cardClassName="rounded-none shadow-none border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
