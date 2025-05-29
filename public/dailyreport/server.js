const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
app.use(bodyParser.json({limit: '10mb'}));

const EXCEL_FILE = path.join(__dirname, 'reporte_maestro.xlsx');

// Obtiene el último ID usado en el Excel
function getLastId() {
  if (!fs.existsSync(EXCEL_FILE)) return 0;
  const workbook = XLSX.readFile(EXCEL_FILE);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, {header:1});
  if (data.length < 2) return 0;
  const lastRow = data[data.length - 1];
  return parseInt(lastRow[0]) || 0;
}

// Ruta para guardar el reporte
app.post('/guardar-reporte', (req, res) => {
  const data = req.body;
  let workbook, worksheet;
  let isNew = false;

  if (fs.existsSync(EXCEL_FILE)) {
    workbook = XLSX.readFile(EXCEL_FILE);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.aoa_to_sheet([[
      "ID Reporte",
      "Proyecto",
      "Nombre de Usuario",
      "RUT de Usuario",
      "Fecha de emisión",
      "Clima",
      "Trabajador",
      "Especialidad",
      "Área",
      "Tarea realizada",
      "HH ejecutadas",
      "Tag",
      "Unidad de medida",
      "Cantidad de tag",
      "Comentario/Observaciones"
    ]]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");
    isNew = true;
  }

  // Obtener el nuevo ID
  const lastId = getLastId();
  const newId = lastId + 1;

  // Por cada trabajador y tarea, genera una fila
  const filas = [];
  (data.hh || []).forEach(hhItem => {
    // Buscar la tarea correspondiente
    const tarea = (data.tareas || []).find(t => t.tarea === hhItem.tarea && (t.tag === hhItem.tag || !t.tag));
    // Buscar el trabajador correspondiente
    const trabajador = (data.cuadrilla || []).find(trab => trab.rut === hhItem.rut);

    // Buscar tag y cantidad
    let tag = "N/A";
    let unidad = "N/A";
    let cantidad = "N/A";
    if (tarea && tarea.tag) {
      tag = tarea.tag;
      // Buscar unidad y cantidad en tags
      const tagInfo = (data.tags || []).find(tg => tg.tag === tarea.tag);
      unidad = tarea.unidad || "N/A";
      cantidad = tagInfo ? tagInfo.cantidad : "N/A";
    }

    filas.push([
      newId,
      tarea?.proyecto || "N/A",
      data.supervisor || "N/A",
      trabajador?.rut || "N/A",
      data.fecha || "N/A",
      data.clima || "N/A",
      trabajador?.nombre || "N/A",
      trabajador?.especialidad || "N/A",
      tarea?.area || "N/A",
      hhItem.tarea || "N/A",
      hhItem.hh || 0,
      tag,
      unidad,
      cantidad,
      data.comentarios || ""
    ]);
  });

  // Si no hay filas (por ejemplo, no hay HH), igual guarda una fila mínima
  if (filas.length === 0) {
    filas.push([
      newId,
      data.tareas?.[0]?.proyecto || "N/A",
      data.supervisor || "N/A",
      data.cuadrilla?.[0]?.rut || "N/A",
      data.fecha || "N/A",
      data.clima || "N/A",
      data.cuadrilla?.[0]?.nombre || "N/A",
      data.cuadrilla?.[0]?.especialidad || "N/A",
      data.tareas?.[0]?.area || "N/A",
      data.tareas?.[0]?.tarea || "N/A",
      0,
      "N/A",
      "N/A",
      "N/A",
      data.comentarios || ""
    ]);
  }

  // Agrega las filas al Excel
  const sheetData = XLSX.utils.sheet_to_json(worksheet, {header:1});
  filas.forEach(row => sheetData.push(row));
  const newSheet = XLSX.utils.aoa_to_sheet(sheetData);
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  XLSX.writeFile(workbook, EXCEL_FILE);

  res.json({ok:true});
});

app.use(express.static(__dirname));
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));