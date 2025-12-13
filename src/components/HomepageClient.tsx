"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import USPAccordion from "@/components/USPaccordion";

// Icons
import {
  IoDocumentTextOutline,
  IoCutOutline,
  IoImageOutline,
  IoSpeedometerOutline,
  IoResizeOutline,
  IoSwapHorizontalOutline,
  IoColorWandOutline,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoFlashOutline,
  IoPhonePortraitOutline,
} from "react-icons/io5";

/* ============================================================
   TOOL LIST (SEO should scan them clearly)
============================================================ */
const tools = [
  // PDF Tools
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one clean document.",
    href: "/tools/pdf/merge",
    category: "pdf",
    tag: "PDF",
    icon: IoDocumentTextOutline,
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Extract specific pages or page ranges from any PDF.",
    href: "/tools/pdf/split",
    category: "pdf",
    tag: "PDF",
    icon: IoCutOutline,
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce PDF size without losing clarity.",
    href: "/tools/pdf/compress",
    category: "pdf",
    tag: "Advanced",
    icon: IoImageOutline,
  },

  // Image Tools
  {
    id: "compress-image",
    title: "Compress Image",
    description: "Reduce image size while keeping high quality.",
    href: "/tools/image/compress",
    category: "image",
    tag: "Image",
    icon: IoSpeedometerOutline,
  },
  {
    id: "resize-image",
    title: "Resize Image",
    description: "Resize images by width, height, or percentage.",
    href: "/tools/image/resize",
    category: "image",
    tag: "Image",
    icon: IoResizeOutline,
  },
  {
    id: "convert-image",
    title: "Image Converter",
    description: "Convert JPG, PNG, WebP and more instantly.",
    href: "/tools/image/convert",
    category: "image",
    tag: "Image",
    icon: IoSwapHorizontalOutline,
  },


];

/* ============================================================
   MAIN HOMEPAGE (SEMANTIC + SEO SAFE)
============================================================ */
export default function HomePage() {
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools;
    const q = query.toLowerCase();
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="py-8 md:py-12 px-4">
      {/* =======================================================
          HERO SECTION (header semantic)
      ======================================================= */}
      <header
        className="relative mb-16 md:mb-20"
        aria-labelledby="hero-title"
        role="banner"
      >
        {/* Floating Gradient Background Blobs */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-20 right-0 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative grid gap-10 md:grid-cols-2 items-center">
          {/* ========== HERO TEXT ========== */}
          <div>
            <h1
              id="hero-title"
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4"
            >
              Your workspace for <br />
              <span className="text-blue-600">PDF</span> &{" "}
              <span className="text-purple-600">Image</span> 
            </h1>

            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              Fast, secure and mobile-friendly tools for editing PDFs, compressing images and converting formats  — all inside your browser.
            </p>

            {/* CTA Buttons */}
            <nav className="mt-5 flex gap-3 flex-wrap" aria-label="Primary navigation">
              <Link
                href="/tools/pdf"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 w-full sm:w-auto"
              >
                PDF Tools
              </Link>
              <Link
                href="/tools/image"
                className="rounded-xl px-5 py-2.5 text-sm font-medium border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 w-full sm:w-auto"
              >
                Image Tools
              </Link>

            </nav>

            {/* Search */}
            <aside className="mt-6 max-w-md" aria-label="Tool search bar">
              <label
                htmlFor="search-tools"
                className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2"
              >
                Search Tools
              </label>

              <input
                id="search-tools"
                placeholder="Search PDF or Image tools..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </aside>
          </div>

          {/* HERO IMAGES */}
          <div className="hidden md:flex relative justify-center" aria-hidden="true">
            <img
              src="/assets/home/hero-main-light.png"
              className="w-[85%] rounded-3xl shadow-xl dark:hidden floating"
              alt="PDF & Image toolkit preview"
            />

            <img
              src="/assets/home/hero-main-dark.png"
              className="w-[85%] rounded-3xl shadow-xl hidden dark:block floating"
              alt="PDF & Image toolkit preview dark"
            />

            {/* Floating small images */}
            <img
              src="/assets/home/hero-img-1-light.png"
              className="absolute -top-6 -left-6 w-28 rounded-xl shadow-lg dark:hidden floating-slow"
              alt="example tool preview"
            />

            <img
              src="/assets/home/hero-img-1-dark.png"
              className="absolute -top-6 -left-6 w-28 rounded-xl shadow-lg hidden dark:block floating-slow"
              alt="example tool preview"
            />

            <img
              src="/assets/home/hero-img-2-light.png"
              className="absolute bottom-4 -right-4 w-32 rounded-xl shadow-lg dark:hidden floating-slow"
              alt="example tool preview"
            />

            <img
              src="/assets/home/hero-img-2-dark.png"
              className="absolute bottom-4 -right-4 w-32 rounded-xl shadow-lg hidden dark:block floating-slow"
              alt="example tool preview"
            />
          </div>
        </div>
      </header>

      {/* =======================================================
          PDF / IMAGE / AI Category Sections
      ======================================================= */}
      <CategorySection
        title="PDF Tools"
        href="/tools/pdf"
        tools={filteredTools.filter((t) => t.category === "pdf").slice(0, 3)}
        mobileBtnColor="blue"
        id="pdf-tools-section"
      />

      <CategorySection
        title="Image Tools"
        href="/tools/image"
        tools={filteredTools.filter((t) => t.category === "image").slice(0, 3)}
        mobileBtnColor="purple"
        id="image-tools-section"
      />



      {/* =======================================================
          USP SECTION — ACCORDION (SEO Semantic)
      ======================================================= */}
      <section
        className="mt-16"
        id="why-pixeldrift"
        aria-labelledby="usp-title"
      >
        <h2
          id="usp-title"
          className="text-3xl md:text-4xl font-bold text-center mb-8"
        >
          Why choose <span className="text-blue-600">PixelDrift</span>?
        </h2>

        <div className="max-w-full mx-auto space-y-4">
          <USPAccordion
            delay={0}
            icon={IoShieldCheckmarkOutline}
            title="Privacy First"
            text="All processing happens inside your browser or via in-memory APIs. Nothing gets uploaded or stored."
          />

          <USPAccordion
            delay={100}
            icon={IoFlashOutline}
            title="Lightning Fast"
            text="Optimized algorithms ensure PDF, image and AI tools run instantly without slowdown."
          />

          <USPAccordion
            delay={200}
            icon={IoPhonePortraitOutline}
            title="Mobile Friendly"
            text="A clean UI designed to work smoothly on smartphones, tablets and desktops."
          />

          <USPAccordion
            delay={300}
            icon={IoLockClosedOutline}
            title="Secure Processing"
            text="Encrypted APIs and local-browser operations keep your files private."
          />

          <USPAccordion
            delay={400}
            icon={IoImageOutline}
            title="High-Quality Outputs"
            text="Smart rendering ensures clarity and sharpness across all conversions."
          />

          
        </div>
      </section>

      {/* Floating Animations */}
      <style>{`
        .floating { animation: float 5s ease-in-out infinite; }
        .floating-slow { animation: float 7s ease-in-out infinite; }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </main>
  );
}

/* ============================================================
   SEO-FRIENDLY CATEGORY SECTION COMPONENT
============================================================ */
function CategorySection({ title, href, tools, mobileBtnColor, id }: any) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-label`}
      className="mt-14"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id={`${id}-label`} className="text-2xl font-bold">
          {title}
        </h2>

        <Link
          href={href}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool: any) => (
          
            <ToolCard key={tool.id} {...tool} aria-label={tool.title}/>
        ))}
      </div>

      {/* Mobile View All */}
      <div className="mt-4 md:hidden">
        <Link
          href={href}
          className={`block w-full text-center bg-${mobileBtnColor}-600 text-white py-2.5 rounded-xl font-medium shadow hover:bg-${mobileBtnColor}-700`}
        >
          View all {title} →
        </Link>
      </div>
    </section>
  );
}
