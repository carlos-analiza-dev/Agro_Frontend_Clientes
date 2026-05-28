import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const DetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-screen">
      <div className="p-4">
        <Skeleton className="w-full h-[450px] rounded-xl" />
      </div>
      <div className="p-5 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-16" />
        </div>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <div className="flex gap-3 items-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </div>
  );
};

export default DetailsSkeleton;
