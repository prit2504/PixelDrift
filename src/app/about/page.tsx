// src/app/about/page.tsx
import type { Metadata } from "next";
import { ShieldCheck, Zap, Smartphone, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | PixelDrift — PDF & Image Tools",
  description:
    "Learn about PixelDrift — our mission, values, privacy-focused processing and commitment to fast and easy PDF & Image tools.",
};

export default function AboutPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto">

      {/* HERO */}
      <section className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          About <span className="text-blue-600">PixelDrift</span>
        </h1>

        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          PixelDrift is your fast, private, and easy workspace for managing PDF & Image files.
          Our goal is simple: give you powerful tools without complicated software, ads overload,
          or privacy concerns.
        </p>
      </section>

      {/* VALUES SECTION */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Our Core Values</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <ShieldCheck className="text-blue-600 dark:text-blue-400 mb-3" size={30} />
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your files are processed **in-memory only**. Nothing is uploaded or stored.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <Zap className="text-yellow-500 dark:text-yellow-400 mb-3" size={30} />
            <h3 className="font-semibold mb-2">Fast & Lightweight</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our tools run instantly with optimizations built for both mobile & desktop.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
            <Smartphone className="text-purple-600 dark:text-purple-400 mb-3" size={30} />
            <h3 className="font-semibold mb-2">Simple by Design</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No clutter. No confusion. Just clean workflows and fast results.
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE HANDLE FILES */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">How Your Files Are Processed</h2>

        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          PixelDrift was built with security and privacy in mind. All file operations such as
          compression, conversion, merging, or splitting occur directly **in-memory** and are
          never saved or logged.
        </p>

        <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
          <li>Your files are never written to disk.</li>
          <li>No user-uploaded content is stored on the server.</li>
          <li>All processing happens live and the file disappears after download.</li>
          <li>No background analytics on file content.</li>
        </ul>
      </section>

      {/* WHO WE ARE */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Who We Are</h2>

        <div className="p-6 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex gap-4 items-start">
          <Users className="text-indigo-500 dark:text-indigo-400 mt-1" size={32} />

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            PixelDrift is created by a small team of developers passionate about building clean,
            fast utilities that solve real daily problems. We focus on privacy, performance,
            and user-friendly experiences.
            <br /><br />
            If you want to collaborate, suggest tools, or report issues — we’d love to hear from you.
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
