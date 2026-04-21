import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  textColor: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  gradientFrom,
  gradientTo,
  iconColor,
  textColor,
}: StatCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} border`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${textColor}`}>{title}</p>
            <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
          </div>

          <div className="p-3 bg-white/20 rounded-full">
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
