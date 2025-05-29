"use client";

import { FaBriefcase, FaGlobe, FaMap } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/visor360",
      icon: <FaGlobe className="w-6 h-10" />,
      tooltip: "Vista 360°",
    },
    {
      href: "/dashboard",
      icon: <FaBriefcase className="w-6 h-10" />,
      tooltip: "Dashboard",
    },
    {
      href: "/mapa",
      icon: <FaMap className="w-6 h-10" />,
      tooltip: "Georreferencia",
    },
  ];

  return (
    <aside className="bg-white h-screen w-20 shadow-md flex flex-col items-center py-6 space-y-6 relative">
      {/* Logo centrado */}
      <Image
        src="/logo.png"
        alt="Logo Virtual Valley"
        width={40}
        height={40}
        priority
      />

      <div className="w-12 border-t-2 border-black my-4" />

      {/* Íconos con navegación */}
      <nav className="flex flex-col gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex justify-center text-gray-700 hover:text-accent ${
              pathname === item.href ? "text-accent font-bold" : ""
            }`}
          >
            {item.icon}
            <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              {item.tooltip}
            </span>
          </Link>
        ))}
      </nav>

      <div className="w-12 border-t-2 border-black mt-auto mb-2" />
    </aside>
  );
}
