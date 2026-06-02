import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CategorySkeleton = () => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div className="w-full">
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-20 mx-auto mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySkeleton;
