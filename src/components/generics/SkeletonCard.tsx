import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="container p-6">
      <div className="flex justify-center mb-8">
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-neutral-primary-soft block w-full max-w-md mx-auto p-8 border border-default rounded-xl shadow-lg"
          >
            <Skeleton className="w-full aspect-square rounded-xl" />

            <div className="mt-8 space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
            </div>

            <div className="mt-8">
              <Skeleton className="h-6 w-1/3" />
            </div>

            <div className="flex justify-center mt-8">
              <Skeleton className="h-12 w-40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;
