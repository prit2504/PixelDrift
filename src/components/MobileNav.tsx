"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// --- React Icons ---
import { 
  IoHomeOutline,
  IoDocumentTextOutline,
  IoImageOutline,
  IoSparklesOutline,
} from "react-icons/io5";

export default function MobileNav() {
  const pathname = usePathname();

  // Add AI Tools tab here
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <IoHomeOutline size={22} />,
    },
    {
      label: "PDF",
      href: "/tools/pdf",
      icon: <IoDocumentTextOutline size={22} />,
    },
    {
      label: "Image",
      href: "/tools/image",
      icon: <IoImageOutline size={22} />,
    },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] sm:hidden z-50">
      <div
        className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl 
                   border border-gray-200 dark:border-neutral-700 
                   rounded-2xl shadow-lg flex justify-around py-3 px-2"
      >
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition
                ${
                  active
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-600 dark:text-gray-300"
                }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
