"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  Calendar,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface KPI {
  avance_pct: number;
  hh_ganadas: number;
  hh_gastadas: number;
  productividad_fisica: number;
  hh_acumuladas: { fecha: string; hh_acumuladas: number }[];
  hh_por_especialidad: {
    fechas: string[];
    estructura: number[];
    civil: number[];
    electrico: number[];
    piping: number[];
    operadores: number[];
  };
  actividades_proximas: { actividad: string; start: string }[];
  ruta_critica: { actividad: string; start: string; finish: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<KPI | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/dashboard/data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-10">Cargando dashboard...</div>;

  const kpis = [
    {
      icon: <TrendingUp className="text-green-600 w-6 h-6" />,
      title: "% de avance proyecto",
      value: `${data.avance_pct}%`,
    },
    {
      icon: <BarChart2 className="text-blue-600 w-6 h-6" />,
      title: "HH ganadas",
      value: data.hh_ganadas.toLocaleString("es-CL"),
    },
    {
      icon: <CheckCircle className="text-amber-600 w-6 h-6" />,
      title: "HH gastadas",
      value: data.hh_gastadas.toLocaleString("es-CL"),
    },
    {
      icon: <Calendar className="text-purple-600 w-6 h-6" />,
      title: "P.F.",
      value: data.productividad_fisica.toFixed(2),
    },
  ];

  return (
    <div className="p-6 w-full overflow-x-hidden">
      <div className="flex flex-row gap-6">
        {/* Panel izquierdo */}
        <div className="w-2/3 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Avance físico</h1>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-4 flex items-center gap-4 border"
              >
                <div className="bg-gray-100 p-3 rounded-xl">{kpi.icon}</div>
                <div>
                  <p className="text-xs text-gray-400">{kpi.title}</p>
                  <p className="text-xl font-bold">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actividades */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow border max-h-[400px] overflow-y-auto">
              <h2 className="font-semibold mb-2 text-gray-700">🧭 Ruta Crítica</h2>
              <ul className="text-sm text-gray-700 space-y-1 max-h-64 overflow-y-auto">
                {data.ruta_critica.map((a, i) => (
                  <li key={i}>📌 {a.actividad} ({a.start} → {a.finish})</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl shadow border max-h-[400px] overflow-y-auto">
              <h2 className="font-semibold mb-2 text-gray-700">📆 Actividades próximas</h2>
              <ul className="text-sm text-gray-700 space-y-1 max-h-64 overflow-y-auto">
                {data.actividades_proximas.map((a, i) => (
                  <li key={i}>🔜 {a.actividad} ({a.start})</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Histograma acumulado */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              📈 Histograma de Avance Acumulado (HH)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.hh_acumuladas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hh_acumuladas"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="w-1/3 flex flex-col gap-4 max-h-screen overflow-y-auto pr-2">
          {/* Botones */}
          <div className="flex flex-col gap-4">
            <a
              href="https://dailyreportapp-f2bsa9aydhergmgr.chilecentral-01.azurewebsites.net/index.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow w-full">
                Ingreso Diario de Actividades
              </button>
            </a>
            <Link href="/dailyreport/listado">
              <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded shadow w-full">
                Ver Reportes Enviados
              </button>
            </Link>
          </div>

          {/* Gráficos por especialidad */}
          {Object.entries(data.hh_por_especialidad)
            .filter(([key]) => key !== "fechas")
            .map(([esp, valores], idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow border">
                <h3 className="text-sm font-semibold text-gray-700 capitalize mb-2">
                  HH - {esp}
                </h3>
                <div className="w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.hh_por_especialidad.fechas.map((fecha, i) => ({
                        fecha,
                        hh: valores[i],
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="fecha"
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="hh"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 1 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
