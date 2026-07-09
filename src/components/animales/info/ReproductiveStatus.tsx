"use client";

interface Props {
  sexo: "Macho" | "Hembra";
  valor: boolean | undefined;
}

const ReproductiveStatus = ({ sexo, valor }: Props) => {
  const label = sexo === "Macho" ? "Castrado" : "Esterilizado";
  const texto = valor === true ? "Sí" : "No";

  return (
    <div className="flex items-center gap-2 rounded-md bg-background p-2 my-1">
      <span className="text-sm font-medium">{label}:</span>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          valor ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"
        }`}
      >
        {texto}
      </span>
    </div>
  );
};

export default ReproductiveStatus;
