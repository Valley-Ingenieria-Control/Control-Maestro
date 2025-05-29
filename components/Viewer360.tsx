"use client";

import { useEffect } from "react";

interface Viewer360Props {
  imageUrl: string;
}

export default function Viewer360({ imageUrl }: Viewer360Props) {
  useEffect(() => {
    const container = document.getElementById("panorama-container");
    if (!container || typeof window === "undefined") return;

    let panorama: any;
    let viewer: any;

    const startViewer = () => {
      panorama = new (window as any).PANOLENS.ImagePanorama("");
      viewer = new (window as any).PANOLENS.Viewer({
        container,
        controlBar: true,
        autoHideInfospot: true,
        cameraFov: 75,
      });

      viewer.add(panorama);
      panorama.load(imageUrl); // Carga después de inicializar
    };

    const preloadImage = (url: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => startViewer();
      img.onerror = () => console.error("Error cargando imagen 360:", url);
    };

    const waitForPanolens = setInterval(() => {
      if ((window as any).PANOLENS && (window as any).THREE) {
        clearInterval(waitForPanolens);
        preloadImage(imageUrl);
      }
    }, 100);

    return () => {
      clearInterval(waitForPanolens);
      if (container) container.innerHTML = "";
    };
  }, [imageUrl]);

  return (
    <div
      id="panorama-container"
      style={{ width: "100%", height: "100%", backgroundColor: "black" }}
    />
  );
}
