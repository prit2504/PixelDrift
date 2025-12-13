"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Shield,
  HelpCircle,
  Info,
} from "lucide-react";

/* ---------------------------------------------
   TOOL DATA
--------------------------------------------- */
const pdfTools = [
  { label: "Merge PDF", href: "/tools/pdf/merge" },
  { label: "Split PDF", href: "/tools/pdf/split" },
  { label: "Compress PDF", href: "/tools/pdf/compress" },
  { label: "Image to PDF", href: "/tools/pdf/image-to-pdf" },
];

const imageTools = [
  { label: "Compress Image", href: "/tools/image/compress" },
  { label: "Resize Image", href: "/tools/image/resize" },
  { label: "Convert Image", href: "/tools/image/convert" },
];

const infoPages = [
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: HelpCircle },
  { label: "Privacy Policy", href: "/privacy", icon: Shield },
  { label: "Terms of Service", href: "/terms", icon: Shield },
  { label: "FAQs", href: "/faq", icon: HelpCircle },
];

/* ---------------------------------------------
   MAIN NAVBAR
--------------------------------------------- */
export default function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [imgOpen, setImgOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (pdfRef.current && !pdfRef.current.contains(e.target as Node)) setPdfOpen(false);
      if (imgRef.current && !imgRef.current.contains(e.target as Node)) setImgOpen(false);
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) setInfoOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-lg border-b z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={140}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <DesktopDropdown
            title="PDF Tools"
            items={pdfTools}
            pathname={pathname}
            open={pdfOpen}
            setOpen={setPdfOpen}
            refObj={pdfRef}
            closeOthers={[setImgOpen, setInfoOpen]}
          />

          <DesktopDropdown
            title="Image Tools"
            items={imageTools}
            pathname={pathname}
            open={imgOpen}
            setOpen={setImgOpen}
            refObj={imgRef}
            closeOthers={[setPdfOpen, setInfoOpen]}
          />

          <DesktopDropdownIcons
            title="More"
            items={infoPages}
            pathname={pathname}
            open={infoOpen}
            setOpen={setInfoOpen}
            refObj={infoRef}
            closeOthers={[setPdfOpen, setImgOpen]}
          />
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="md:hidden p-2 rounded-md border"
        >
          {openMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {openMenu && (
        <MobileMenu
          pathname={pathname}
          pdfTools={pdfTools}
          imageTools={imageTools}
          infoPages={infoPages}
          closeMenu={() => setOpenMenu(false)}
        />
      )}
    </nav>
  );
}

/* ---------------------------------------------
   DESKTOP DROPDOWN
--------------------------------------------- */
function DesktopDropdown({
  title,
  items,
  pathname,
  open,
  setOpen,
  closeOthers,
  refObj,
}: any) {
  return (
    <div ref={refObj} className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          closeOthers.forEach((fn: any) => fn(false));
        }}
        className="flex items-center gap-1 font-medium hover:text-blue-600"
      >
        {title}
        <ChevronDown size={16} className={open ? "rotate-180 transition" : "transition"} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-neutral-900 border rounded-xl shadow-lg p-3">
          {items.map((item: any) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-neutral-800
                ${pathname === item.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------
   DESKTOP DROPDOWN WITH ICONS
--------------------------------------------- */
function DesktopDropdownIcons({
  title,
  items,
  pathname,
  open,
  setOpen,
  closeOthers,
  refObj,
}: any) {
  return (
    <div ref={refObj} className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          closeOthers.forEach((fn: any) => fn(false));
        }}
        className="flex items-center gap-1 font-medium hover:text-blue-600"
      >
        {title}
        <ChevronDown size={16} className={open ? "rotate-180 transition" : "transition"} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-neutral-900 border rounded-xl shadow-lg p-3">
          {items.map((item: any) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-neutral-800
                ${pathname === item.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
                }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------
   MOBILE MENU
--------------------------------------------- */
function MobileMenu({ pathname, pdfTools, imageTools, infoPages, closeMenu }: any) {
  return (
    <div className="md:hidden bg-white dark:bg-neutral-900 border-t p-4 space-y-4">
      <MobileSection label="PDF Tools" items={pdfTools} pathname={pathname} closeMenu={closeMenu} />
      <MobileSection label="Image Tools" items={imageTools} pathname={pathname} closeMenu={closeMenu} />
      <MobileSection label="More" items={infoPages} pathname={pathname} closeMenu={closeMenu} withIcons />
    </div>
  );
}

/* ---------------------------------------------
   MOBILE SECTION
--------------------------------------------- */
function MobileSection({ label, items, pathname, closeMenu, withIcons }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between w-full font-medium py-2"
      >
        {label}
        <ChevronDown size={18} className={open ? "rotate-180 transition" : "transition"} />
      </button>

      {open && (
        <div className="pl-3 space-y-2">
          {items.map((item: any) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`flex items-center gap-2 text-sm
                ${pathname === item.href
                  ? "text-blue-600"
                  : "text-gray-700 dark:text-gray-300"
                }`}
            >
              {withIcons && item.icon && <item.icon size={16} />}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
