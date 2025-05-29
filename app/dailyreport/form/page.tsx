"use client";

import { useState } from "react";

export default function DailyReportForm() {
  const [clima, setClima] = useState("");
  const [fecha, setFecha] = useState("");
  const [turno, setTurno] = useState("");
  const [supervisor, setSupervisor] = useState("Cristobal Luengo"); // Por ahora estático

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded-xl shadow">
      {/* Logo + Título */}
      <div className="text-center mb-6">
        <img
          src="/dailyreport/APC-logo.png"
          alt="Automation Productivity Control"
          className="mx-auto mb-2 w-32"
        />
        <h2 className="text-2xl font-bold text-gray-700">Daily Report</h2>
      </div>

      {/* Clima, Fecha, Turno, Supervisor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Clima */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Condición climática</label>
          <select
            value={clima}
            onChange={(e) => setClima(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccione</option>
            <option value="Soleado">Soleado</option>
            <option value="Nublado">Nublado</option>
            <option value="Lluvia">Lluvia</option>
            <option value="Tormenta">Tormenta</option>
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Turno */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Turno</label>
          <select
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccione</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
          </select>
        </div>

        {/* Supervisor */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Supervisor</label>
          <input
            type="text"
            value={supervisor}
            disabled
            className="border p-2 rounded w-full bg-gray-100 text-gray-600"
          />
        </div>
      </div>
    </div>
  );
}
