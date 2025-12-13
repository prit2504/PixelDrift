import Link from "next/link";
import React from "react";

export interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ComponentType<any>;
  tag?: string;
  category?: "pdf" | "image" | string;
}

/* -----------------------------
   CATEGORY-BASED UI COLORS
----------------------------- */
const categoryColors: Record<string, string> = {
  pdf: "from-blue-500/20 to-blue-600/20",
  image: "from-purple-500/20 to-purple-600/20",
};

const iconBgColors: Record<string, string> = {
  pdf: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
  image: "bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-300",
};

export default function ToolCard({
  title,
  description,
  href,
  icon: Icon,
  tag,
  category = "default",
}: ToolCardProps) {
  const glowColor = categoryColors[category] || "from-gray-300/20 to-gray-600/20";
  const iconColor = iconBgColors[category] || "bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300";

  return (
    <Link
      href={href}
      className="
        group relative p-3 sm:p-6 rounded-2xl
        bg-white/80 dark:bg-neutral-800/80
        border border-gray-200 dark:border-neutral-700
        shadow-sm backdrop-blur-xl
        overflow-hidden transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1 
      "
    >
      {/* Gradient border on hover */}
      <div
        className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition 
          bg-gradient-to-br ${glowColor} blur-xl
        `}
      />

      {/* Glass layer */}
      <div className="absolute inset-0 rounded-2xl backdrop-blur-xl opacity-0 group-hover:opacity-20 transition" />

      <div className="relative z-10 flex flex-col gap-4">

        {/* Icon with animation */}
        {Icon && (
          <div
            className={`
              h-12 w-12 rounded-xl flex items-center justify-center shadow 
              transition-all duration-300 ${iconColor}
              group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-[4deg]
            `}
          >
            <Icon size={22} />
          </div>
        )}

        {/* Title + Tag */}
        <div>
          <h3 className="text-sm sm:text-lg font-semibold mb-1 leading-tight">{title}</h3>

          {tag && (
            <span
              className="
                inline-block text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full 
                bg-gray-100 dark:bg-neutral-700 
                text-gray-600 dark:text-gray-300 
                uppercase tracking-wide
              "
            >
              {tag}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>

        {/* CTA */}
        <span className="
          mt-auto inline-flex items-center text-sm font-medium
          text-blue-600 dark:text-blue-400 
          transition-all duration-300
          group-hover:translate-x-1 group-hover:underline
        ">
          Open tool →
        </span>
      </div>
    </Link>
  );
}
