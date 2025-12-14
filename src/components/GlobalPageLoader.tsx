"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FileText, Image as ImageIcon } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function GlobalPageLoader() {
  const pathname = usePathname();

  const [routeLoading, setRouteLoading] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState("Starting server…");

  /* -------------------------------
     ROUTE CHANGE LOADER
  -------------------------------- */
  useEffect(() => {
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), 400);
    return () => clearTimeout(t);
  }, [pathname]);

  /* -------------------------------
     BACKEND COLD START CHECK
  -------------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function wakeBackend() {
      try {
        setMessage("Starting server…");

        const res = await fetch(`${API_URL}/health`, {
          cache: "no-store",
        });

        if (!cancelled && res.ok) {
          setBackendReady(true);
          setMessage("Loading tools…");
        }
      } catch {
        // backend sleeping → retry
        setTimeout(wakeBackend, 2000);
      }
    }

    wakeBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  /* -------------------------------
     CONTROL VISIBILITY
  -------------------------------- */
  useEffect(() => {
    if (backendReady && !routeLoading) {
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    } else {
      setShow(true);
    }
  }, [backendReady, routeLoading]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      {/* ICON */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>

        <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 px-6 py-4 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800">
          <FileText className="h-8 w-8 text-blue-600 animate-bounce" />
          <ImageIcon className="h-8 w-8 text-purple-500 animate-bounce delay-150" />
        </div>
      </div>

      {/* TEXT */}
      <p className="text-sm text-white/90 dark:text-gray-200 font-medium tracking-wide mb-4">
        {message}
      </p>

      {/* PROGRESS BAR */}
      <div className="w-44 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progressSlide"></div>
      </div>
    </div>
  );
}
