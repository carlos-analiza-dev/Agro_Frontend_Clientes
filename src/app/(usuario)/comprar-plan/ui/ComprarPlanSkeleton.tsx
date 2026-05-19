import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ComprarPlanSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-24 mx-auto mb-2" />
                <Skeleton className="h-8 w-32 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Skeleton className="h-12 w-32 mx-auto" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
