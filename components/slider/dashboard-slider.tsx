"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BaseSeasonSlider } from "./base-season-slider";

export function SeasonSlider() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  // Handler for when season changes after debounce
  const handleSeasonChange = React.useCallback((season: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("season", season.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false }); // Prevent scroll reset
  }, [pathname, router, searchParams]);

  return (
    <BaseSeasonSlider
      initialSeason={initialSeason}
      onSeasonChange={handleSeasonChange}
    />
  );
}