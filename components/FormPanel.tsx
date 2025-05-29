"use client";
import { motion } from "framer-motion";

interface FormPanelProps {
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  selectedSector: string;
  setSelectedSector: (value: string) => void;
  avanceFisico: number;
  setAvanceFisico: (value: number) => void;
  handleSubmit: () => void;
  mensaje: string;
}

export default function FormPanel({
  selectedDate,
  setSelectedDate,
  selectedSector,
  setSelectedSector,
  avanceFisico,
  setAvanceFisico,
  handleSubmit,
  mensaje,
}: FormPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-t-xl px-6 py-4 flex flex-wrap justify-center items-end gap-8"
      style={{ zIndex: 10 }}
    >
      <div className="flex flex-col w-48">
        <label className="text-white text-sm mb-2">Fecha</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-white text-black rounded-lg px-3 py-2"
        />
      </div>

      <div className="flex flex-col w-48">
        <label className="text-white text-sm mb-2">Sector</label>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="w-full bg-white text-black rounded-lg px-3 py-2"
        >
          <option value="Sector A">Sector A</option>
          <option value="Sector B">Sector B</option>
          <option value="Sector C">Sector C</option>
        </select>
      </div>

      <div className="flex flex-col w-48">
        <label className="text-white text-sm mb-2">Avance Físico (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={avanceFisico}
          onChange={(e) => setAvanceFisico(Number(e.target.value))}
          className="w-full bg-white text-black rounded-lg px-3 py-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-accent text-white px-5 py-2 rounded-xl hover:bg-accent/90 transition font-semibold"
      >
        Registrar Avance
      </button>

      {mensaje && (
        <p className="w-full text-center text-white font-semibold mt-2">
          {mensaje}
        </p>
      )}
    </motion.div>
  );
}
