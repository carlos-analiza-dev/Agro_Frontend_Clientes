import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableEscalaInsumo from "./TableEscalaInsumo";
import { AgroInsumo } from "@/api/agroservicio/insumos/interfaces/response-agro-insumos.interface";

interface Props {
  propietarioId: string;
  moneda: string;
  selectedInsumo: AgroInsumo | null;
}

const OptionsInsumos = ({ moneda, propietarioId, selectedInsumo }: Props) => {
  return (
    <div className="h-full w-full">
      <Tabs defaultValue="escala" className="h-full w-full flex flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="escala" className="flex-1">
            Escalas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="escala" className="flex-1 overflow-auto">
          <TableEscalaInsumo
            selectedInsumo={selectedInsumo}
            moneda={moneda}
            propietarioId={propietarioId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptionsInsumos;
