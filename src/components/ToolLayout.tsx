import Sidebar from "./ToolSidebar";
import Link from "next/link";

export default function ToolLayout({
  title,
  description,
  sidebarCategory,
  children,
}: {
  title: string;
  description: string;
  sidebarCategory: "pdf" | "image";
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 py-10">
      
      {/* Sidebar */}
        <Sidebar activeCategory={sidebarCategory}/>

      {/* Main Content */}
      <div>
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-5"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-2">{title}</h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          {description}
        </p>

        {children}
      </div>

    </div>
  );
}
