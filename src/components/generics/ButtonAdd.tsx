import React from "react";
import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  Icon: LucideIcon;
  action: () => void;
}

const ButtonAdd = ({ title, Icon, action }: Props) => {
  return (
    <Button
      onClick={() => action()}
      className="w-full mt-4 md:w-auto md:mt-0 bg-green-600 hover:bg-green-700"
    >
      <Icon className="h-4 w-4" />
      {title}
    </Button>
  );
};

export default ButtonAdd;
