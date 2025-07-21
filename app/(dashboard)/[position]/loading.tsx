import DashboardSkeleton from "@/components/graphs/skeletons/skeleton-dashboard"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      <DashboardSkeleton />
    </div>
  )
} 