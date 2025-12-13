"use client";

import { useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

function USPAccordion({ icon: Icon, title, text, delay = 0 }: any) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  /* ---------------------------
     Intersection Observer
  ---------------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        bg-white dark:bg-neutral-800 
        border border-gray-200 dark:border-neutral-700 
        rounded-xl shadow-sm backdrop-blur-xl overflow-hidden
        transition-all duration-300
        ${visible ? "animate-fadeSlideUp" : "opacity-0 translate-y-8"}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 md:px-5 md:py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="
              h-9 w-9 md:h-10 md:w-10 rounded-lg flex items-center justify-center 
              bg-gradient-to-br from-blue-500/10 to-purple-500/10 
              text-blue-600 dark:text-blue-300 
              transition-transform duration-300
            "
          >
            <Icon size={18} />
          </div>
          <span className="font-semibold text-base md:text-lg">{title}</span>
        </div>

        <IoChevronDown
          size={18}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expanded Content */}
      <div
        className={`
          px-4 md:px-5 pb-4 text-gray-600 dark:text-gray-300 text-sm 
          overflow-hidden transition-all duration-500
          ${open ? "max-h-[300px]" : "max-h-0"}
        `}
      >
        <p className={`${open ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
          {text}
        </p>
      </div>
    </div>
  );
}

export default USPAccordion;
