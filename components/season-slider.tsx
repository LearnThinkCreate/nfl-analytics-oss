"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";

const DEBOUNCE_TIME = 500; // 500ms debounce time

export function SeasonSlider() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Get initial season from URL or default to 2024
  const initialSeason = React.useMemo(() => {
    const seasonParam = searchParams.get("season");
    if (seasonParam) {
      const parsedSeason = parseInt(seasonParam, 10);
      if (!isNaN(parsedSeason) && parsedSeason >= 1999 && parsedSeason <= 2024) {
        return parsedSeason;
      }
    }
    return 2024; // Default to 2024 if no valid season
  }, [searchParams]);

  // State to hold the currently selected value for immediate visual feedback
  const [selectedSeason, setSelectedSeason] = React.useState(initialSeason);

  // Update the selected season state immediately when the slider moves
  const handleValueChange = React.useCallback((values: number[]) => {
    const season = values[0];
    setSelectedSeason(season);

    // Clear any existing debounce timer
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new debounce timer to update the URL
    debounceTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      params.set("season", season.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false }); // Prevent scroll reset
    }, DEBOUNCE_TIME);
  }, [pathname, router, searchParams]);

  // Effect to clear timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);
  
  // Update selectedSeason if the URL param changes externally
  React.useEffect(() => {
    setSelectedSeason(initialSeason);
  }, [initialSeason]);

  return (
    <div className="w-full px-2 space-y-2">
      <div className="flex justify-between">
        <span className="text-sm">Season</span>
        {/* Display the live selected season */}
        <span className="text-sm ">{selectedSeason}</span> 
      </div>
      <Slider
        value={[selectedSeason]} // Control the slider value with state
        min={1999}
        max={2024}
        step={1}
        onValueChange={handleValueChange} // Use onValueChange for live updates
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1999</span>
        <span>2024</span>
      </div>
    </div>
  );
} 