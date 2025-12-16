import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <header
      className="relative mb-16 md:mb-20"
      role="banner"
      aria-labelledby="hero-title"
    >
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-20 right-0 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h1
            id="hero-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Your workspace for{" "}
            <span className="text-blue-600">PDF</span> &{" "}
            <span className="text-purple-600">Image</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-lg">
            Fast, secure and mobile-friendly tools for editing PDFs, compressing
            images and converting formats — all inside your browser.
          </p>

          <nav className="mt-5 flex gap-3 flex-wrap">
            <Link
              href="/tools/pdf"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700"
            >
              PDF Tools
            </Link>

            <Link
              href="/tools/image"
              className="rounded-xl px-5 py-2.5 text-sm font-medium border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              Image Tools
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex justify-center" aria-hidden="true">
          <Image
            src="/assets/home/hero-main-dark.webp"
            alt="PixelDrift PDF and Image tools preview"
            width={800}
            height={520}
            priority
            className="rounded-3xl shadow-xl floating"
          />
        </div>
      </div>
    </header>
  );
}
