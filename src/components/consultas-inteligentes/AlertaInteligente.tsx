import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Info } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

const AlertaInteligente = ({ title, description }: Props) => {
  return (
    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-300 font-semibold">
        {title}
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300">
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default AlertaInteligente;
