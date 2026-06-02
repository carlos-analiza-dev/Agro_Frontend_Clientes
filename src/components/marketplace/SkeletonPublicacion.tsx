import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonPublicacion = () => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-40" />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
                ))}
              </div>

              <Skeleton className="h-4 w-56" />
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-7 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <Skeleton className="h-7 w-48" />

              <Skeleton className="h-10 w-full" />

              <Skeleton className="h-10 w-full" />

              <Skeleton className="h-32 w-full" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-5">
              <Skeleton className="h-7 w-52" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-10 w-full sm:w-1/2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-5">
              <Skeleton className="h-7 w-40" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-10 w-full" />

              <Skeleton className="h-28 w-full" />
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Skeleton className="h-10 w-full sm:w-28" />
            <Skeleton className="h-10 w-full sm:w-40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPublicacion;
