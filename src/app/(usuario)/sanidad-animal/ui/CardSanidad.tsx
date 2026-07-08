import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  parrafo: string;
  Icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  iconBgClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  parrafoClassName?: string;
}

const CardSanidad = ({
  title,
  description,
  parrafo,
  Icon,
  className = "",
  iconClassName = "text-emerald-600 dark:text-emerald-400",
  iconBgClassName = "bg-emerald-100 dark:bg-emerald-500/10",
  titleClassName = "text-slate-900 dark:text-white",
  descriptionClassName = "text-slate-500 dark:text-slate-400",
  parrafoClassName = "text-slate-600 dark:text-slate-300",
}: Props) => {
  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300",
              iconBgClassName,
            )}
          >
            <Icon
              size={22}
              className={cn("transition-colors duration-300", iconClassName)}
            />
          </div>

          <div className="flex-1">
            <CardTitle
              className={cn(
                "text-lg font-semibold transition-colors duration-300",
                titleClassName,
              )}
            >
              {title}
            </CardTitle>

            <p
              className={cn(
                "mt-1 text-sm transition-colors duration-300",
                descriptionClassName,
              )}
            >
              {description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50 transition-colors duration-300">
          <p
            className={cn(
              "text-sm leading-6 transition-colors duration-300",
              parrafoClassName,
            )}
          >
            {parrafo}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardSanidad;
