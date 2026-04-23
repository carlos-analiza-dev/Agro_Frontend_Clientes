import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Props {
  handleExportToExcel: () => void;
  isMobile?: true;
}

const ExportButton = ({ handleExportToExcel, isMobile }: Props) => {
  return (
    <Button
      onClick={handleExportToExcel}
      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
      size={isMobile ? "default" : "sm"}
    >
      <Download className="mr-2 h-4 w-4" />
      Exportar Excel
    </Button>
  );
};

export default ExportButton;
