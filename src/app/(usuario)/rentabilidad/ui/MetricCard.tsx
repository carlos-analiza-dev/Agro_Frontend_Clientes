import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  prefix = "",
  suffix = "",
  decimal = 0,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
  prefix?: string;
  suffix?: string;
  decimal?: number;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">
        {title}
      </CardTitle>
      <div className={`p-2 rounded-full ${bgColor}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>
        {prefix}
        {value.toLocaleString(undefined, {
          minimumFractionDigits: decimal,
          maximumFractionDigits: decimal,
        })}
        {suffix}
      </div>
    </CardContent>
  </Card>
);
