import { POSITIONS } from "@/lib/constants/common"
import { NavTabs, NavTabsList, NavTabsTrigger } from "@/components/ui/nav-tabs"
import { cn } from "@/lib/utils"

export default function Nav({ className, href, displayValue }: { className?: string, href?: string, displayValue?: boolean }) {
    const headerTabs = Object.keys(POSITIONS).map((pos) => ({
        label: POSITIONS[pos as keyof typeof POSITIONS],
        value: pos.toLowerCase(),
      }))

    return (
        <NavTabs className={cn("", className)}>
            <NavTabsList className="w-full">
                {headerTabs.map((tab) => (
                    <NavTabsTrigger key={tab.value} value={tab.value} preserveQueryParams={true} href={href ? `${href}/${tab.value}` : undefined}>
                        {displayValue ? tab.value.toUpperCase() : tab.label}
                    </NavTabsTrigger>
                ))}
            </NavTabsList>
        </NavTabs>
    )

}