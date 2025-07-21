import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <Card className="w-full flex flex-col relative">
            <CardHeader className="flex-shrink-0">
                <CardTitle><Skeleton className="h-6 w-16" /></CardTitle>
                <CardDescription><Skeleton className="h-6 w-16" /></CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}