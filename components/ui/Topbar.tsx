"use client";

import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";

export function Topbar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-16 bg-white shadow flex items-center justify-between px-4"
    >
      <div className="flex items-center gap-2">
        <FaBars className="h-6 w-6 text-accent" />
        <span className="text-xl font-bold text-gray-800">Virtual Valley</span>
      </div>
      {/* Botón eliminado */}
    </motion.div>
  );
}
