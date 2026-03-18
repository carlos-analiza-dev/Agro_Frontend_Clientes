import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface MessageErrorProps {
  titulo: string;
  descripcion: string;
  onPress?: () => void;
}

export const MessageError = ({
  titulo,
  descripcion,
  onPress,
}: MessageErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{titulo}</AlertTitle>
        <AlertDescription>{descripcion}</AlertDescription>
      </Alert>
      {onPress && (
        <Button onClick={onPress} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      )}
    </div>
  );
};
