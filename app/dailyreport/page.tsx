"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DailyReportPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dailyreport/form");
  }, [router]);

  return null;
}
