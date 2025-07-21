import { NavTabs, NavTabsList, NavTabsTrigger } from "@/components/ui/nav-tabs"
import { cn } from "@/lib/utils"

export default function Nav({ 
    className, 
    playerId, 
    latestSeason 
}: { 
    className?: string, 
    playerId: string, 
    latestSeason?: number 
}) {
    const headerTabs = [
        {
            label: "Season Stats",
            value: `${latestSeason}`,
            href: `/player/${playerId}`,
            disabled: !latestSeason,
            matchSeason: true
        },
        {
            label: "Career Stats",
            value: "career",
            href: `/player/${playerId}/career`,
        },
    ]

    return (
        <NavTabs className={cn("", className)}>
            <NavTabsList>
                {headerTabs.map((tab) => (
                    <NavTabsTrigger key={tab.value} value={tab.value} href={tab.href} disabled={tab.disabled} scroll={false} matchSeason={tab.matchSeason}>
                        {tab.label}
                    </NavTabsTrigger>
                ))}
            </NavTabsList>
        </NavTabs>
    )

}