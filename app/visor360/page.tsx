"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import UploadImageForm from "@/components/UploadImageForm";

const Viewer360 = dynamic(() => import("@/components/Viewer360"), { ssr: false });

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Visor360Page() {
  const [selectedDate, setSelectedDate] = useState("2025-05-17");
  const [selectedSector, setSelectedSector] = useState("Sector C");
  const [imageUrl, setImageUrl] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(false);

  const buscarImagen = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/imagenes360/?fecha=${selectedDate}&sector=${encodeURIComponent(selectedSector)}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Imagen obtenida:", data);
        setImageUrl(`${API_BASE_URL}${data.ruta_imagen}`);
      } else {
        setImageUrl("");
      }
    } catch (error) {
      console.error("Error al buscar imagen:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Botón subir */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-teal-600 text-white px-5 py-2 rounded-xl hover:bg-teal-700 transition font-semibold"
        >
          {mostrarFormulario ? "Ocultar Formulario" : "Subir Imágenes 360°"}
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="absolute top-20 right-4 z-20 bg-white p-4 rounded-xl shadow-lg">
          <UploadImageForm />
        </div>
      )}

      {/* Filtros */}
      <div className="absolute top-4 left-4 z-20 bg-white p-4 rounded-xl shadow shadow-md">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="border p-2 mb-2 w-full"
        >
          <option>Sector A</option>
          <option>Sector B</option>
          <option>Sector C</option>
        </select>
        <button
          onClick={buscarImagen}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Buscar imagen
        </button>
        {loading && <p className="text-gray-400 mt-2">Cargando...</p>}
      </div>

      {/* Visor 360 */}
      <div className="w-full h-full flex items-center justify-center">
        {imageUrl ? (
          <Viewer360 imageUrl={imageUrl} />
        ) : (
          <p className="text-white text-sm text-center">
            Selecciona una imagen para ver en 360°
          </p>
        )}
      </div>
    </div>
  );
}
