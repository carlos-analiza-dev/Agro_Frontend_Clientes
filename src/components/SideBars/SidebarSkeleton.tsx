import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

const SidebarSkeleton = () => {
  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-gray-100">
          <Skeleton className="h-7 w-32" />
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200">
                <div className="flex items-center justify-between py-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="space-y-2 pl-2 mt-2 mb-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 border-t border-gray-100">
            <Separator className="my-4" />
            <div className="flex w-full items-center rounded-lg px-4 py-3">
              <Skeleton className="h-5 w-5 mr-3" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
