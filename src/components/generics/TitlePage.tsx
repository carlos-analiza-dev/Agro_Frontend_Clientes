import { LucideIcon } from "lucide-react";

interface Props {
  Icon: LucideIcon;
  title: string;
  description?: string;
  id_title?: string;
  id_description?: string;
}

const TitlePage = ({
  Icon,
  title,
  description,
  id_title,
  id_description,
}: Props) => {
  return (
    <div>
      <h1
        id={id_title}
        className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 capitalize"
      >
        <Icon className="h-7 w-7 text-green-600" />
        {title}
      </h1>
      {description && (
        <p
          id={id_description}
          className="text-sm md:text-base text-muted-foreground mt-1"
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default TitlePage;
