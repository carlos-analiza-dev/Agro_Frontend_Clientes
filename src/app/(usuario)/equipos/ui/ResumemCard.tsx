import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface Props {
  total: number;
  title: string;
}

const ResumemCard = ({ total, title }: Props) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{total}</div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
};

export default ResumemCard;
