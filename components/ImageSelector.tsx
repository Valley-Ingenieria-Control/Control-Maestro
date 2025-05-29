"use client";

import { useState } from "react";

interface ImagenResponse {
  ruta_imagen: string;
}

interface Props {
  onSelect: (imageUrl: string) => void;
}

const API_BASE_URL = "http://127.0.0.1:8000";

export default function ImageSelector({ onSelect }: Props) {
  const [sector, setSector] = useState("");
  const [fecha, setFecha] = useState("");
  const [imagen, setImagen] = useState<ImagenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchImagen = async () => {
    if (!fecha || !sector) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/imagenes360?fecha=${fecha}&sector=${encodeURIComponent(sector)}`
      );

      if (res.ok) {
        const data = await res.json();
        setImagen(data);
        onSelect(`${API_BASE_URL}${data.ruta_imagen}`);
      } else {
        setImagen(null);
        setError("No se encontró imagen para esos filtros.");
      }
    } catch (err) {
      console.error("Error al obtener la imagen", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Sector</option>
          <option value="Sector A">Sector A</option>
          <option value="Sector B">Sector B</option>
          <option value="Sector C">Sector C</option>
        </select>
      </div>

      <button
        onClick={fetchImagen}
        disabled={!fecha || !sector}
        className="bg-blue-600 text-white rounded px-4 py-2"
      >
        Buscar imagen
      </button>

      {loading && <p className="text-sm text-gray-600">Cargando...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {imagen && (
        <div className="text-sm text-green-600 break-all">
          <p>
            Imagen cargada: {imagen.ruta_imagen.split("/").pop()}
          </p>
          <img
            src={`${API_BASE_URL}${imagen.ruta_imagen}`}
            alt="Miniatura"
            className="mt-2 rounded shadow w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}
