import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-32 w-full" />
    ))}
  </div>
);
