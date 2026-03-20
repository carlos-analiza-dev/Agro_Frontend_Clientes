import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  numero: string;
}

const SummaryCard = ({ numero, title }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{numero}</p>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
