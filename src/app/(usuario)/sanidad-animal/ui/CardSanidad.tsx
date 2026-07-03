import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  parrafo: string;
  Icon: LucideIcon;
}

const CardSanidad = ({ title, description, parrafo, Icon }: Props) => {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Icon size={22} />
          </div>

          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </CardTitle>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {parrafo}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardSanidad;
