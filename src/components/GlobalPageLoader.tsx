"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FileText, Image as ImageIcon } from "lucide-react";

export default function GlobalPageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 650); // slightly longer for premium feel

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">

      {/* Icon Pulse */}
      <div className="relative mb-6 animate-scaleIn">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulseSlow"></div>

        <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 px-6 py-4 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800">
          <FileText className="h-8 w-8 text-blue-600 animate-bounceLight" />
          <ImageIcon className="h-8 w-8 text-purple-500 animate-bounceLight2" />
        </div>
      </div>

      {/* Text */}
      <p className="text-sm text-white/90 dark:text-gray-200 font-medium tracking-wide mb-4">
        Processing...
      </p>

      {/* Progress Pulse Bar */}
      <div className="w-44 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progressSlide"></div>
      </div>
    </div>
  );
}
