import "./globals.css";
import Script from "next/script";
import { Sidebar } from "../components/ui/Sidebar";
import { Topbar } from "../components/ui/Topbar";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Virtual Valley - Dashboard",
  description: "Plataforma de gestión y monitoreo 360°",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Cargar primero THREE, luego PANOLENS */}
        <Script
          src="https://cdn.jsdelivr.net/npm/three@0.105.2/build/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/panolens@0.12.0/build/panolens.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="flex min-h-screen text-gray-800 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 h-full w-full overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
