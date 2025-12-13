"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Are my files saved on your servers?",
    a: "No. PixelDrift processes your files securely in-memory and does not store them. Once your task is completed, all temporary data is discarded immediately.",
  },
  {
    q: "What file types do you support?",
    a: "PDF tools work with standard PDF files. Image tools support JPG, PNG, WebP and sometimes GIF (for single-frame operations). Support for more formats is coming soon.",
  },
  {
    q: "Is there a file size limit?",
    a: "PixelDrift can handle large files, but limits depend on your device and browser memory. For best performance, we recommend files below 200MB, especially on mobile.",
  },
  {
    q: "Does compression reduce quality?",
    a: "Not always. With adjustable quality, DPI and optimization settings, you control how much compression is applied.",
  },
  {
    q: "Are the tools free to use?",
    a: "Yes! All current PDF and image tools on PixelDrift are completely free. Optional premium features may be introduced in the future.",
  },
  {
    q: "Can I integrate these tools into my own app?",
    a: "We are working on dedicated API access. If you're interested in early access or integrations, email us at hello@toolhub.example.",
  },
  {
    q: "Does PixelDrift work on mobile?",
    a: "Absolutely. PixelDrift is optimized for mobile, tablets, and desktops.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div className="py-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqs.map((f, i) => {
          const isOpen = i === openIndex;

          return (
            <div
              key={i}
              className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition"
            >
              {/* Question */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {f.q}
                </span>

                <ChevronDown
                  size={18}
                  className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`grid transition-all duration-300 overflow-hidden ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden px-4 pb-4">
                  <p className="text-gray-700 dark:text-gray-300">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help box */}
      <div className="mt-10 p-5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
          Still need help?
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-200">
          Contact us anytime at{" "}
          <a href="/contact" className="underline font-medium">
            Contact Page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
