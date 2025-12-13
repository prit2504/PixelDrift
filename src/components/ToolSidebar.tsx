"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Icons
import {
  IoDocumentTextOutline,
  IoCutOutline,
  IoImageOutline,
  IoResizeOutline,
  IoSwapHorizontalOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { FaCompress } from "react-icons/fa";

// ------------------ TOOL LISTS ------------------
const pdfTools = [
  { name: "Merge PDF", href: "/tools/pdf/merge", icon: IoDocumentTextOutline },
  { name: "Split PDF", href: "/tools/pdf/split", icon: IoCutOutline },
  { name: "Compress PDF", href: "/tools/pdf/compress", icon: FaCompress },
  { name: "Image to PDF", href: "/tools/pdf/image-to-pdf", icon: IoImageOutline },
];

const imageTools = [
  { name: "Compress Image", href: "/tools/image/compress", icon: FaCompress },
  { name: "Resize Image", href: "/tools/image/resize", icon: IoResizeOutline },
  { name: "Image Converter", href: "/tools/image/convert", icon: IoSwapHorizontalOutline },
];

// ------------------ COMPONENT ------------------
export default function Sidebar({
  activeCategory,
}: {
  activeCategory: "pdf" | "image";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const tools = activeCategory === "pdf" ? pdfTools : imageTools;

  const categoryTitle = activeCategory === "pdf" ? "PDF Tools" : "Image Tools";

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm mb-4"
      >
        <IoMenuOutline size={18} /> Tools Menu
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full md:h-fit w-72 md:w-60 z-40
          bg-white dark:bg-neutral-800 border-r md:border border-gray-200 dark:border-neutral-700
          p-5 rounded-none md:rounded-2xl shadow-lg md:shadow-sm
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-300"
        >
          <IoCloseOutline size={20} /> Close
        </button>

        {/* Category Title */}
        <h2 className="text-lg font-semibold mb-4">{categoryTitle}</h2>

        {/* Tools List */}
        <ul className="space-y-2">
          {tools.map((tool) => {
            const active = pathname === tool.href;
            const Icon = tool.icon;

            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition text-sm
                    ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300"
                    }
                  `}
                >
                  <Icon size={17} />
                  <span>{tool.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
