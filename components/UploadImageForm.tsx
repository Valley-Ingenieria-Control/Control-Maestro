"use client";

import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function UploadImageForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fecha, setFecha] = useState("");
  const [sector, setSector] = useState("Sector A");
  const [mensaje, setMensaje] = useState("");

  const handleUpload = async () => {
    if (!file || !fecha) {
      setMensaje("Debe seleccionar un archivo y una fecha");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("fecha", fecha);
    formData.append("sector", sector);

    try {
      const response = await fetch(`${API_BASE_URL}/imagenes360/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Imagen subida correctamente");
      } else {
        setMensaje(data.error || "Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-72">
      <input type="file" accept="image/jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="border p-2 rounded"
      />
      <select
        value={sector}
        onChange={(e) => setSector(e.target.value)}
        className="border p-2 rounded"
      >
        <option>Sector A</option>
        <option>Sector B</option>
        <option>Sector C</option>
      </select>
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Subir Imagen
      </button>
      {mensaje && <p className="text-sm text-gray-600">{mensaje}</p>}
    </div>
  );
}
