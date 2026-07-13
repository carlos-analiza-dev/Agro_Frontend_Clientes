import { LucideIcon } from "lucide-react";

interface Props {
  Icon: LucideIcon;
  title: string;
  description?: string;
}

const TitlePage = ({ Icon, title, description }: Props) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
        <Icon className="h-7 w-7 text-green-600" />
        {title}
      </h1>
      {description && (
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </div>
  );
};

export default TitlePage;
