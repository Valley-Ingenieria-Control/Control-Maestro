"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Link from "next/link";

interface Reporte {
  id: number;
  proyecto: string;
  supervisor: string;
  usuario_rut: string;
  fecha: string;
  clima: string;
  trabajador_nombre: string;
  trabajador_especialidad: string;
  area: string;
  tarea: string;
  hh: number;
  tag: string;
  unidad: string;
  cantidad: string;
  comentarios: string;
  trabajador_rut: string;

  // Nuevas columnas
  actividad: string;
  tipo_tarea: string;
  firma: string;
}

export default function ListadoReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [correoDestino, setCorreoDestino] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/daily_reports/")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReportes(data);
        } else {
          console.error("La respuesta no es una lista de reportes:", data);
        }
      });
  }, []);

  const reportesFiltrados = reportes.filter((r) => {
    const fechaOk =
      (!desde || r.fecha >= desde) &&
      (!hasta || r.fecha <= hasta);

    const busquedaOk = Object.values(r)
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return fechaOk && busquedaOk;
  });

  const exportarExcel = () => {
    const data = reportesFiltrados.map((r) => ({
      ID: r.id,
      Fecha: r.fecha,
      Proyecto: r.proyecto,
      Supervisor: r.supervisor,
      "Trabajador": r.trabajador_nombre,
      "Especialidad": r.trabajador_especialidad,
      Área: r.area,
      Tarea: r.tarea,
      "Tipo de Tarea": r.tipo_tarea,
      Actividad: r.actividad,
      HH: r.hh,
      Tag: r.tag,
      Unidad: r.unidad,
      Cantidad: r.cantidad,
      Comentarios: r.comentarios,
      Firma: r.firma,
      "RUT Trabajador": r.trabajador_rut,
      Usuario: r.usuario_rut,
      Clima: r.clima
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "reportes_filtrados.xlsx");
  };

  const enviarPorCorreo = () => {
    if (!correoDestino) {
      alert("Debes ingresar un correo destinatario.");
      return;
    }

    const data = reportesFiltrados.map((r) => ({
      ID: r.id,
      Fecha: r.fecha,
      Proyecto: r.proyecto,
      Supervisor: r.supervisor,
      "Trabajador": r.trabajador_nombre,
      "Especialidad": r.trabajador_especialidad,
      Área: r.area,
      Tarea: r.tarea,
      "Tipo de Tarea": r.tipo_tarea,
      Actividad: r.actividad,
      HH: r.hh,
      Tag: r.tag,
      Unidad: r.unidad,
      Cantidad: r.cantidad,
      Comentarios: r.comentarios,
      Firma: r.firma,
      "RUT Trabajador": r.trabajador_rut,
      Usuario: r.usuario_rut,
      Clima: r.clima
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reportes");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const formData = new FormData();
    formData.append("file", blob, "reportes_filtrados.xlsx");
    formData.append("email", correoDestino);

    fetch("http://localhost:8000/send_excel", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => alert(data.message || "Correo enviado"))
      .catch(() => alert("Error al enviar el correo"));
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📋 Listado de Reportes Enviados</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Buscar palabra clave</label>
          <input
            type="text"
            placeholder="Ej: estructura, Juan, hormigón..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border p-2 rounded w-64"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Fecha desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border p-2 rounded w-40"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Fecha hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border p-2 rounded w-40"
          />
        </div>

        <div className="flex">
          <button
            onClick={exportarExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow mt-5"
          >
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* Envío por correo */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="email"
          placeholder="Correo destinatario"
          value={correoDestino}
          onChange={(e) => setCorreoDestino(e.target.value)}
          className="border p-2 rounded w-72"
        />
        <button
          onClick={enviarPorCorreo}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Enviar por Correo
        </button>
        <Link href="/log/emails">
          <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded shadow">
            Historial de Correos
          </button>
        </Link>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl shadow border">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Proyecto</th>
              <th className="px-4 py-2 text-left">Supervisor</th>
              <th className="px-4 py-2 text-left">Usuario</th>
              <th className="px-4 py-2 text-left">Clima</th>
              <th className="px-4 py-2 text-left">Trabajador</th>
              <th className="px-4 py-2 text-left">RUT Trabajador</th>
              <th className="px-4 py-2 text-left">Especialidad</th>
              <th className="px-4 py-2 text-left">Área</th>
              <th className="px-4 py-2 text-left">Tarea</th>
              <th className="px-4 py-2 text-left">Tipo de Tarea</th>
              <th className="px-4 py-2 text-left">Actividad</th>
              <th className="px-4 py-2 text-left">HH</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Unidad</th>
              <th className="px-4 py-2 text-left">Tag</th>
              <th className="px-4 py-2 text-left">Firma</th>
              <th className="px-4 py-2 text-left">Comentarios</th>
            </tr>
          </thead>
          <tbody>
            {reportesFiltrados.map((r, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{r.fecha}</td>
                <td className="px-4 py-2">{r.proyecto}</td>
                <td className="px-4 py-2">{r.supervisor}</td>
                <td className="px-4 py-2">{r.usuario_rut}</td>
                <td className="px-4 py-2">{r.clima}</td>
                <td className="px-4 py-2">{r.trabajador_nombre}</td>
                <td className="px-4 py-2">{r.trabajador_rut}</td>
                <td className="px-4 py-2">{r.trabajador_especialidad}</td>
                <td className="px-4 py-2">{r.area}</td>
                <td className="px-4 py-2">{r.tarea}</td>
                <td className="px-4 py-2">{r.tipo_tarea}</td>
                <td className="px-4 py-2">{r.actividad}</td>
                <td className="px-4 py-2">{r.hh}</td>
                <td className="px-4 py-2">{r.cantidad}</td>
                <td className="px-4 py-2">{r.unidad}</td>
                <td className="px-4 py-2">{r.tag}</td>
                <td className="px-4 py-2">{r.firma}</td>
                <td className="px-4 py-2">{r.comentarios}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
