import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import { Tool } from "./tools";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-600 hover:bg-blue-700",
  purple: "bg-purple-600 hover:bg-purple-700",
};

type Props = {
  id: string;
  title: string;
  href: string;
  tools: Tool[];
  color: "blue" | "purple";
};

export default function CategorySection({
  id,
  title,
  href,
  tools,
  color,
}: Props) {
  return (
    <section id={id} className="mt-14" aria-labelledby={`${id}-title`}>
      <div className="flex items-center justify-between mb-4">
        <h2 id={`${id}-title`} className="text-2xl font-bold">
          {title}
        </h2>

        <Link
          href={href}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} {...tool} />
        ))}
      </div>

      <div className="mt-4 md:hidden">
        <Link
          href={href}
          className={`block w-full text-center text-white py-2.5 rounded-xl font-medium shadow ${COLOR_MAP[color]}`}
        >
          View all {title} →
        </Link>
      </div>
    </section>
  );
}
