"use client";

import { useEffect, useState } from "react";
import ServicesManager from "@/components/Home/Services/ServicesManager";

export default function ServicesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ServicesManager />
    </div>
  );
}
