import {
  IoDocumentTextOutline,
  IoCutOutline,
  IoImageOutline,
  IoSpeedometerOutline,
  IoResizeOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";

export type Tool = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: "pdf" | "image";
  icon: any;
};

export const TOOLS: Tool[] = [
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document.",
    href: "/tools/pdf/merge",
    category: "pdf",
    icon: IoDocumentTextOutline,
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Extract pages or page ranges from a PDF.",
    href: "/tools/pdf/split",
    category: "pdf",
    icon: IoCutOutline,
  },
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce PDF size without losing clarity.",
    href: "/tools/pdf/compress",
    category: "pdf",
    icon: IoImageOutline,
  },
  {
    id: "compress-image",
    title: "Compress Image",
    description: "Reduce image size while keeping high quality.",
    href: "/tools/image/compress",
    category: "image",
    icon: IoSpeedometerOutline,
  },
  {
    id: "resize-image",
    title: "Resize Image",
    description: "Resize images by width, height or percentage.",
    href: "/tools/image/resize",
    category: "image",
    icon: IoResizeOutline,
  },
  {
    id: "convert-image",
    title: "Image Converter",
    description: "Convert JPG, PNG, WebP and more.",
    href: "/tools/image/convert",
    category: "image",
    icon: IoSwapHorizontalOutline,
  },
];
