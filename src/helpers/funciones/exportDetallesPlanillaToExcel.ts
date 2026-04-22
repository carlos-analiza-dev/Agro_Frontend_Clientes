import * as XLSX from "xlsx";

interface DetallePlanilla {
  id: string;
  planillaId: string;
  trabajadorId: string;
  salarioDiario: string;
  valorHoraExtraDiurna: string;
  valorHoraExtraNocturna: string;
  valorHoraExtraFestiva: string;
  diasTrabajados: number;
  diasDescanso: number;
  diasVacaciones: number;
  diasEnfermedad: number;
  diasPermiso: number;
  ausenciasInjustificadas: number;
  horasExtraDiurnas: string;
  horasExtraNocturnas: string;
  horasExtraFestivas: string;
  totalHorasExtras: string;
  bonificaciones: string;
  desgloseBonificaciones: any;
  deducciones: string;
  desgloseDeducciones: any;
  prestamos: string;
  desglosePrestamos: any;
  salarioBase: string;
  totalDevengado: string;
  totalDeduccionesAplicadas: string;
  totalAPagar: string;
  pagado: boolean;
  fechaPago: string | null;
  metodoPago: string | null;
  observaciones: string | null;
  trabajador: {
    nombre: string;
    identificacion: string;
    telefono: string;
    email: string;
  };
}

interface PlanillaData {
  id: string;
  nombre: string;
  descripcion: string;
  tipoPeriodo: string;
  diasPeriodo: number;
  fechaInicio: string;
  fechaFin: string;
  fechaPago: string;
  estado: string;
  totalSalarios: string;
  totalHorasExtras: string;
  totalBonificaciones: string;
  totalDeducciones: string;
  totalNeto: string;
  observaciones: string | null;
  detalles: DetallePlanilla[];
}

interface ExportDetallePlanillaData {
  "Nombre del Trabajador": string;
  Identificación: string;
  Teléfono: string;
  Email: string;
  "Salario Diario": number;
  "Días Trabajados": number;
  "Salario Base": number;
  "Horas Extra Diurnas": number;
  "Horas Extra Nocturnas": number;
  "Horas Extra Festivas": number;
  "Total Horas Extras": number;
  Bonificaciones: number;
  Deducciones: number;
  Préstamos: number;
  "Total Devengado": number;
  "Total a Pagar": number;
  Estado: string;
  "Método de Pago": string;
}

export const exportPlanillaToExcel = (
  planilla: PlanillaData,
  nombreArchivo: string = `planilla_${planilla.nombre}`,
) => {
  const mainData: ExportDetallePlanillaData[] = planilla.detalles.map(
    (detalle) => ({
      "Nombre del Trabajador": detalle.trabajador.nombre,
      Identificación: detalle.trabajador.identificacion,
      Teléfono: detalle.trabajador.telefono,
      Email: detalle.trabajador.email || "No registrado",
      "Salario Diario": Number(detalle.salarioDiario),
      "Días Trabajados": detalle.diasTrabajados,
      "Salario Base": Number(detalle.salarioBase),
      "Horas Extra Diurnas": Number(detalle.horasExtraDiurnas) || 0,
      "Horas Extra Nocturnas": Number(detalle.horasExtraNocturnas) || 0,
      "Horas Extra Festivas": Number(detalle.horasExtraFestivas) || 0,
      "Total Horas Extras": Number(detalle.totalHorasExtras),
      Bonificaciones: Number(detalle.bonificaciones),
      Deducciones: Number(detalle.deducciones),
      Préstamos: Number(detalle.prestamos),
      "Total Devengado": Number(detalle.totalDevengado),
      "Total a Pagar": Number(detalle.totalAPagar),
      Estado: detalle.pagado ? "Pagado" : "Pendiente",
      "Método de Pago": detalle.metodoPago || "-",
    }),
  );

  const worksheetMain = XLSX.utils.json_to_sheet(mainData);

  const colWidths = [
    { wch: 30 },
    { wch: 20 },
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 15 },
  ];
  worksheetMain["!cols"] = colWidths;

  const range = XLSX.utils.decode_range(worksheetMain["!ref"] || "A1:R1");
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!worksheetMain[address]) continue;
    worksheetMain[address].s = {
      font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheetMain, "Detalle Planilla");

  const summaryData = [
    { Métrica: "Nombre de Planilla", Valor: planilla.nombre },
    { Métrica: "Descripción", Valor: planilla.descripcion || "-" },
    { Métrica: "Tipo de Período", Valor: planilla.tipoPeriodo.toUpperCase() },
    { Métrica: "Días del Período", Valor: planilla.diasPeriodo },
    { Métrica: "Fecha Inicio", Valor: planilla.fechaInicio },
    { Métrica: "Fecha Fin", Valor: planilla.fechaFin },
    { Métrica: "Fecha de Pago", Valor: planilla.fechaPago },
    { Métrica: "Estado", Valor: planilla.estado.toUpperCase() },
    { Métrica: "", Valor: "" },
    { Métrica: "Total Trabajadores", Valor: planilla.detalles.length },
    {
      Métrica: "Total Pagados",
      Valor: planilla.detalles.filter((d) => d.pagado).length,
    },
    {
      Métrica: "Total Pendientes",
      Valor: planilla.detalles.filter((d) => !d.pagado).length,
    },
    { Métrica: "", Valor: "" },
    { Métrica: "Total Salarios Base", Valor: Number(planilla.totalSalarios) },
    { Métrica: "Total Horas Extras", Valor: Number(planilla.totalHorasExtras) },
    {
      Métrica: "Total Bonificaciones",
      Valor: Number(planilla.totalBonificaciones),
    },
    { Métrica: "Total Deducciones", Valor: Number(planilla.totalDeducciones) },
    { Métrica: "Total Neto", Valor: Number(planilla.totalNeto) },
  ];

  const worksheetSummary = XLSX.utils.json_to_sheet(summaryData);

  worksheetSummary["!cols"] = [{ wch: 25 }, { wch: 20 }];

  const summaryRange = XLSX.utils.decode_range(
    worksheetSummary["!ref"] || "A1:B18",
  );
  for (let C = summaryRange.s.c; C <= summaryRange.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!worksheetSummary[address]) continue;
    worksheetSummary[address].s = {
      font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
    };
  }

  XLSX.utils.book_append_sheet(workbook, worksheetSummary, "Resumen");

  const horasExtrasData = planilla.detalles.map((detalle) => ({
    "Nombre del Trabajador": detalle.trabajador.nombre,
    "Horas Extra Diurnas": Number(detalle.horasExtraDiurnas) || 0,
    "Valor Hora Extra Diurna": Number(detalle.valorHoraExtraDiurna),
    "Total Diurnas":
      (Number(detalle.horasExtraDiurnas) || 0) *
      Number(detalle.valorHoraExtraDiurna),
    "Horas Extra Nocturnas": Number(detalle.horasExtraNocturnas) || 0,
    "Valor Hora Extra Nocturna": Number(detalle.valorHoraExtraNocturna),
    "Total Nocturnas":
      (Number(detalle.horasExtraNocturnas) || 0) *
      Number(detalle.valorHoraExtraNocturna),
    "Horas Extra Festivas": Number(detalle.horasExtraFestivas) || 0,
    "Valor Hora Extra Festiva": Number(detalle.valorHoraExtraFestiva),
    "Total Festivas":
      (Number(detalle.horasExtraFestivas) || 0) *
      Number(detalle.valorHoraExtraFestiva),
    "Total General Horas Extras": Number(detalle.totalHorasExtras),
  }));

  const worksheetHorasExtras = XLSX.utils.json_to_sheet(horasExtrasData);
  worksheetHorasExtras["!cols"] = [
    { wch: 30 },
    { wch: 18 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 22 },
    { wch: 15 },
    { wch: 18 },
    { wch: 20 },
    { wch: 15 },
    { wch: 22 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheetHorasExtras, "Horas Extras");

  const fecha = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${nombreArchivo}_${fecha}.xlsx`);
};

export const exportPlanillaDetalleOnly = (
  planilla: PlanillaData,
  nombreArchivo: string = `detalle_planilla_${planilla.nombre}`,
) => {
  const data: ExportDetallePlanillaData[] = planilla.detalles.map(
    (detalle) => ({
      "Nombre del Trabajador": detalle.trabajador.nombre,
      Identificación: detalle.trabajador.identificacion,
      Teléfono: detalle.trabajador.telefono,
      Email: detalle.trabajador.email || "No registrado",
      "Salario Diario": Number(detalle.salarioDiario),
      "Días Trabajados": detalle.diasTrabajados,
      "Salario Base": Number(detalle.salarioBase),
      "Horas Extra Diurnas": Number(detalle.horasExtraDiurnas) || 0,
      "Horas Extra Nocturnas": Number(detalle.horasExtraNocturnas) || 0,
      "Horas Extra Festivas": Number(detalle.horasExtraFestivas) || 0,
      "Total Horas Extras": Number(detalle.totalHorasExtras),
      Bonificaciones: Number(detalle.bonificaciones),
      Deducciones: Number(detalle.deducciones),
      Préstamos: Number(detalle.prestamos),
      "Total Devengado": Number(detalle.totalDevengado),
      "Total a Pagar": Number(detalle.totalAPagar),
      Estado: detalle.pagado ? "Pagado" : "Pendiente",
      "Método de Pago": detalle.metodoPago || "-",
    }),
  );

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 15 },
  ];

  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:R1");
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!worksheet[address]) continue;
    worksheet[address].s = {
      font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center" },
    };
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Detalle Planilla");

  const fecha = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${nombreArchivo}_${fecha}.xlsx`);
};
