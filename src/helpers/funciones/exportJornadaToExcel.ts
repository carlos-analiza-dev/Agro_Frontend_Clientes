import * as XLSX from "xlsx";
import { Jornada } from "@/api/jornadas-trabajador/interface/response-jornadas.interface";

interface ExportJornadaData {
  Trabajador: string;
  Identificacion: string;
  Fecha: string;
  Estado: string;
  "Horas Extras Diurnas": number;
  "Horas Extras Nocturnas": number;
  "Horas Extras Festivas": number;
  "Total Horas Extras": number;
  "Labor Realizada": string;
  Observaciones: string;
  Sincronizado: string;
}

export const exportJornadasToExcel = (
  jornadas: Jornada[],
  nombreArchivo: string = "jornadas_trabajadores",
) => {
  const data: ExportJornadaData[] = jornadas.map((jornada) => ({
    Trabajador: jornada.trabajador.nombre,
    Identificacion: jornada.trabajador.identificacion,
    Fecha: jornada.fecha,
    Estado: jornada.trabajo ? "Trabajó" : "No trabajó",
    "Horas Extras Diurnas": Number(jornada.horasExtrasDiurnas) || 0,
    "Horas Extras Nocturnas": Number(jornada.horasExtrasNocturnas) || 0,
    "Horas Extras Festivas": Number(jornada.horasExtrasFestivas) || 0,
    "Total Horas Extras":
      (Number(jornada.horasExtrasDiurnas) || 0) +
      (Number(jornada.horasExtrasNocturnas) || 0) +
      (Number(jornada.horasExtrasFestivas) || 0),
    "Labor Realizada": jornada.laborRealizada || "",
    Observaciones: jornada.observaciones || "",
    Sincronizado: jornada.sincronizado ? "Sí" : "No",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const colWidths = [
    { wch: 30 },
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 16 },
    { wch: 40 },
    { wch: 40 },
    { wch: 12 },
  ];
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Jornadas");

  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:K1");
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!worksheet[address]) continue;
    worksheet[address].s = {
      font: { bold: true, sz: 12 },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center" },
    };
  }

  const fecha = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${nombreArchivo}_${fecha}.xlsx`);
};

export const exportJornadasWithSummary = (
  jornadas: Jornada[],
  nombreArchivo: string = "jornadas_trabajadores",
) => {
  const mainData = jornadas.map((jornada) => ({
    Trabajador: jornada.trabajador.nombre,
    Identificacion: jornada.trabajador.identificacion,
    Fecha: jornada.fecha,
    Estado: jornada.trabajo ? "Trabajó" : "No trabajó",
    "Horas Extras Diurnas": Number(jornada.horasExtrasDiurnas) || 0,
    "Horas Extras Nocturnas": Number(jornada.horasExtrasNocturnas) || 0,
    "Horas Extras Festivas": Number(jornada.horasExtrasFestivas) || 0,
    "Labor Realizada": jornada.laborRealizada || "",
    Observaciones: jornada.observaciones || "",
  }));

  const worksheetMain = XLSX.utils.json_to_sheet(mainData);

  const totalRegistros = jornadas.length;
  const totalTrabajaron = jornadas.filter((j) => j.trabajo).length;
  const totalNoTrabajaron = totalRegistros - totalTrabajaron;
  const totalHorasExtrasDiurnas = jornadas.reduce(
    (sum, j) => sum + (Number(j.horasExtrasDiurnas) || 0),
    0,
  );
  const totalHorasExtrasNocturnas = jornadas.reduce(
    (sum, j) => sum + (Number(j.horasExtrasNocturnas) || 0),
    0,
  );
  const totalHorasExtrasFestivas = jornadas.reduce(
    (sum, j) => sum + (Number(j.horasExtrasFestivas) || 0),
    0,
  );
  const totalHorasExtras =
    totalHorasExtrasDiurnas +
    totalHorasExtrasNocturnas +
    totalHorasExtrasFestivas;

  const summaryData = [
    { Métrica: "Total Registros", Valor: totalRegistros },
    { Métrica: "Días Trabajados", Valor: totalTrabajaron },
    { Métrica: "Días No Trabajados", Valor: totalNoTrabajaron },
    { Métrica: "Total Horas Extras Diurnas", Valor: totalHorasExtrasDiurnas },
    {
      Métrica: "Total Horas Extras Nocturnas",
      Valor: totalHorasExtrasNocturnas,
    },
    { Métrica: "Total Horas Extras Festivas", Valor: totalHorasExtrasFestivas },
    { Métrica: "Total General Horas Extras", Valor: totalHorasExtras },
  ];

  const worksheetSummary = XLSX.utils.json_to_sheet(summaryData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheetMain, "Jornadas");
  XLSX.utils.book_append_sheet(workbook, worksheetSummary, "Resumen");

  const fecha = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${nombreArchivo}_${fecha}.xlsx`);
};
