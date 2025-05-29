"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Log {
  id: number;
  destinatario: string;
  fecha_envio: string;
  mensaje: string;
}

export default function HistorialCorreos() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/email_logs/")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  const logsFiltrados = logs.filter((log) => {
    const fechaLog = new Date(log.fecha_envio).toISOString().split("T")[0];
    const cumpleFecha =
      (!desde || fechaLog >= desde) && (!hasta || fechaLog <= hasta);

    const cumpleBusqueda =
      log.destinatario.toLowerCase().includes(busqueda.toLowerCase()) ||
      log.mensaje.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleFecha && cumpleBusqueda;
  });

  const exportarExcel = () => {
    const datos = logsFiltrados.map((log) => ({
      Destinatario: log.destinatario,
      Fecha: new Date(log.fecha_envio).toLocaleString(),
      Mensaje: log.mensaje,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial Correos");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      "historial_correos_filtrados.xlsx"
    );
  };

  return (
    <div className="p-8 space-y-6">
      {/* Título y exportar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📨 Historial de Correos Enviados</h1>
        <button
          onClick={exportarExcel}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Exportar a Excel
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por destinatario o mensaje..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <input
          type="date"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl shadow border">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Destinatario</th>
              <th className="px-4 py-2 text-left">Fecha de Envío</th>
              <th className="px-4 py-2 text-left">Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {logsFiltrados.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{log.destinatario}</td>
                <td className="px-4 py-2">
                  {new Date(log.fecha_envio).toLocaleString()}
                </td>
                <td className="px-4 py-2">{log.mensaje}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
