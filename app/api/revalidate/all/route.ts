import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  // List all your cache tags here
  const cacheTags = [
    'player-table-stats',
    'player-bar-chart-data',
    'player-rankings',
    'player-stat-card-batch',
    'player-bio',
    'player-metrics',
    'top-search-results',
    'player-seasons',
    'last-season-played',
    // etc.
  ];
  
  // Revalidate all tags
  console.log('Starting revalidation of tags:', cacheTags);
    
  for (const tag of cacheTags) {
    console.log(`Revalidating tag: ${tag}`);
    revalidateTag(tag);
  }
  
  console.log('Revalidation complete');
  
  return NextResponse.json({ 
    revalidated: true, 
    tags: cacheTags,
    timestamp: new Date().toISOString() 
  });
}