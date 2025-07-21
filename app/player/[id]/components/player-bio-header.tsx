import Image from "next/image";
import {
  Ruler,
  Scale,
  CalendarDays,
  School,
  Award,
  Clock,
} from "lucide-react";
import { PlayerBio } from "@/types/player";

export default function NFLPlayerBioHeader({
  player,
}: {
  player: PlayerBio;
}) {

  // Split name for stylistic display
  const nameParts = player.displayName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  return (
    <div 
      className="relative w-full overflow-hidden pb-8 bg-white text-black"
    >
      {/* Square grid background pattern */}
      <div className="absolute inset-0 opacity-7">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      
      {/* Team color gradient background */}
      <div
        className="absolute inset-0 bg-linear-to-r/oklch from-(--team-primary) to-(--team-secondary) opacity-18"
        aria-hidden="true"
      />

      {/* Team logo watermark */}
      <div className="absolute right-0 bottom-0 opacity-[0.1] transform translate-x-1/4 translate-y-1/4 pointer-events-none select-none block @3xl/page:hidden @5xl/page:block">
        <Image
          src={player.logo || "/placeholder.svg"}
          alt={player.teamName}
          width={500}
          height={500}
          className="object-contain"
        />
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 py-8 relative">
        {/* Player jersey number - oversized background element */}
        <div 
          className="absolute -right-10 xl:-right-20 top-10 text-[14rem] font-black text-opacity-10 select-none hidden @5xl/page:block"
          style={{ 
            color: 'var(--team-primary)',
            opacity: 0.05,
            lineHeight: 0.8,
          }}
        >
          {player.jerseyNumber}
        </div>
        
        {/* Main layout grid */}
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6 relative">
          {/* Player image column */}
          <div className="md:col-span-3 lg:col-span-4">
            <div className="relative transform-3d perspective-distant group">
              {/* Image container with premium styling */}
              <div
                className="relative overflow-hidden rounded-xl shadow-xl aspect-[3/4] transform-3d group-hover:rotate-y-2 transition-transform duration-500 ease-fluid"
                style={{
                  boxShadow: `0 15px 30px -8px var(--team-primary)40, 0 0 0 1px var(--team-primary)20`,
                }}
              >
                {/* Player headshot */}
                <Image
                  src={player.headshot || "/player-placeholder.png"}
                  alt={player.displayName}
                  fill
                  className="object-cover object-top"
                  priority
                />

                {/* Player image overlays for visual interest */}
                <div 
                  className="absolute inset-0 bg-linear-to-b/oklch from-transparent to-(--team-primary)/40"
                  aria-hidden="true"
                />
                
                {/* Diagonal stripes overlay - adds texture */}
                <div 
                  className="absolute inset-0 opacity-10" 
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, var(--team-secondary), var(--team-secondary) 1px, transparent 1px, transparent 10px)`,
                  }}
                />

                {/* Jersey number overlay */}
                <div className="absolute bottom-3 right-3">
                  <div className="text-6xl md:text-7xl font-bold text-white drop-shadow-md">
                    {player.jerseyNumber}
                  </div>
                </div>
                
                {/* Position badge */}
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold shadow-md backdrop-blur-sm"
                  style={{ 
                    backgroundColor: `var(--team-primary)90`,
                    color: "white"
                  }}
                >
                  {player.position}
                </div>
                
                {/* Team small badge */}
                <div 
                  className="absolute top-4 right-4 w-10 h-10 rounded-full p-1 shadow-md backdrop-blur-sm"
                  style={{ 
                    backgroundColor: `white`,
                  }}
                >
                  <Image
                    src={player.logo || "/placeholder.svg"}
                    alt={player.teamName}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Player information column */}
          <div className="md:col-span-5 lg:col-span-8 flex flex-col justify-center">
            {/* Team and position */}
            <div
              className="flex items-center mb-2"
            >
              <div
                className="h-6 w-2 mr-2 rounded-full"
                style={{ backgroundColor: player.secondaryColor }}
              />
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: player.secondaryColor }}
              >
                {player.teamName} · {player.position}
              </span>
            </div>

            {/* Player name with stylistic treatment */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-2">
              <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground mb-1">
                {firstName}
              </span>
              <span style={{ color: 'var(--team-primary)' }}>{lastName}</span>
            </h1>
            
            <div className="text-sm text-muted-foreground mb-6">
              {player.draftInfo} • {player.experience} years experience
            </div>

            {/* Stats grid - using Tailwind grid system for responsive layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <StatItem 
                icon={<Ruler />} 
                label="Height" 
                value={player.height} 
                teamColor={player.primaryColor}
              />
              <StatItem 
                icon={<Scale />} 
                label="Weight" 
                value={`${player.weight} lbs`} 
                teamColor={player.primaryColor}
              />
              <StatItem 
                icon={<CalendarDays />} 
                label="Age" 
                value={player.age.toString()} 
                teamColor={player.primaryColor}
              />
              <StatItem 
                icon={<Clock />} 
                label="Experience" 
                value={`${player.experience} yrs`} 
                teamColor={player.primaryColor}
              />
              <StatItem 
                icon={<School />} 
                label="College" 
                value={player.collegeName} 
                teamColor={player.primaryColor}
              />
              <StatItem 
                icon={<Award />} 
                label="Draft" 
                value={player.draftNumber ? `Rd ${player.draftround}, #${player.draftNumber}` : 'UDFA'} 
                teamColor={player.primaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Item Component with icon and styling
const StatItem = ({ 
  icon, 
  label, 
  value, 
  teamColor 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  teamColor: string;
}) => {
  return (
    <div className="flex items-center space-x-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${teamColor}20` }}
      >
        <div className="w-6 h-6" style={{ color: teamColor }}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
};