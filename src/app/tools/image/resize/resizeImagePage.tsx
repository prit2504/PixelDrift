"use client";

import { useEffect, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { UploadCloud, X, DownloadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

/* ---------------------------------------------
   TYPES
---------------------------------------------- */

type NumberOrEmpty = number | "";

interface PreviewItem {
  file: File;
  url: string;
  name: string;
  w: number;
  h: number;
}

interface PresetItem {
  label: string;
  w: number | null;
  h: number | null;
}

/* ---------------------------------------------
   PRESETS
---------------------------------------------- */

const PRESETS: PresetItem[] = [
  { label: "Custom", w: null, h: null },
  { label: "Instagram (1080×1080)", w: 1080, h: 1080 },
  { label: "Facebook Cover (820×312)", w: 820, h: 312 },
  { label: "Twitter (1600×900)", w: 1600, h: 900 },
  { label: "YouTube Thumbnail (1280×720)", w: 1280, h: 720 },
  { label: "HD (1920×1080)", w: 1920, h: 1080 },
];

/* ---------------------------------------------
   MAIN COMPONENT
---------------------------------------------- */

export default function ResizeNewPage() {
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [preset, setPreset] = useState("Custom");

  const [width, setWidth] = useState<NumberOrEmpty>("");
  const [height, setHeight] = useState<NumberOrEmpty>("");
  const [percentage, setPercentage] = useState<NumberOrEmpty>("");

  const [keepRatio, setKeepRatio] = useState(true);
  const [beforeMode, setBeforeMode] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /* ---------------------------------------------
     CLEANUP
  ---------------------------------------------- */

  useEffect(() => {
    return () => {
      items.forEach((i) => URL.revokeObjectURL(i.url));
    };
  }, [items]);

  /* ---------------------------------------------
     FILE UPLOAD
  ---------------------------------------------- */

  function onFilesSelected(list: FileList | null) {
    if (!list) return;

    const images = Array.from(list).filter((f) =>
      f.type.startsWith("image/")
    );

    if (!images.length) {
      toast.error("Please upload valid images.");
      return;
    }

    images.forEach((file) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        setItems((prev) => [
          ...prev,
          {
            file,
            url,
            name: file.name,
            w: img.width,
            h: img.height,
          },
        ]);
      };

      img.src = url;
    });
  }

  function removeItem(index: number) {
    URL.revokeObjectURL(items[index].url);
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  /* ---------------------------------------------
     PRESET
  ---------------------------------------------- */

  function applyPreset(label: string) {
    setPreset(label);
    const p = PRESETS.find((x) => x.label === label);

    if (p?.w && p?.h) {
      setWidth(p.w);
      setHeight(p.h);
      setPercentage("");
    } else {
      setWidth("");
      setHeight("");
      setPercentage("");
    }
  }

  /* ---------------------------------------------
     RESIZE PREVIEW (CANVAS)
  ---------------------------------------------- */

  async function drawPreview(item: PreviewItem) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = item.url;

    await img.decode();

    let targetW = item.w;
    let targetH = item.h;

    if (!beforeMode) {
      if (percentage) {
        targetW = Math.round(item.w * (percentage / 100));
        targetH = Math.round(item.h * (percentage / 100));
      } else if (width || height) {
        if (keepRatio) {
          const ratio = item.w / item.h;
          if (width) {
            targetW = width;
            targetH = Math.round(width / ratio);
          } else if (height) {
            targetH = height;
            targetW = Math.round(height * ratio);
          }
        } else {
          targetW = width || item.w;
          targetH = height || item.h;
        }
      }
    }

    canvas.width = targetW;
    canvas.height = targetH;

    // Progressive downscale for large images
    let srcCanvas: HTMLCanvasElement | OffscreenCanvas =
      "OffscreenCanvas" in window
        ? new OffscreenCanvas(img.width, img.height)
        : document.createElement("canvas");

    srcCanvas.width = img.width;
    srcCanvas.height = img.height;

    const sctx = srcCanvas.getContext("2d")!;
    sctx.drawImage(img, 0, 0);

    while (srcCanvas.width / 2 > targetW) {
      const tmp =
        "OffscreenCanvas" in window
          ? new OffscreenCanvas(srcCanvas.width / 2, srcCanvas.height / 2)
          : document.createElement("canvas");

      tmp.width = srcCanvas.width / 2;
      tmp.height = srcCanvas.height / 2;

      tmp
        .getContext("2d")!
        .drawImage(srcCanvas as any, 0, 0, tmp.width, tmp.height);

      srcCanvas = tmp;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(srcCanvas as any, 0, 0, targetW, targetH);
  }

  useEffect(() => {
    if (items[0]) drawPreview(items[0]);
  }, [items, width, height, percentage, keepRatio, beforeMode]);

  /* ---------------------------------------------
     UI
  ---------------------------------------------- */

  return (
    <ToolLayout
      title="Resize Image (Advanced)"
      description="Preview resize instantly using canvas. Optimized for large images."
      sidebarCategory="image"
    >
      {/* UPLOAD */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFilesSelected(e.dataTransfer.files);
        }}
        className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer"
      >
        <UploadCloud className="mx-auto h-10 w-10 text-blue-500 mb-3" />
        <p className="text-sm">Click or drag images</p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => onFilesSelected(e.target.files)}
        />
      </div>

      {/* PREVIEW */}
      {items.length > 0 && (
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">
              {beforeMode ? "Original Preview" : "Resized Preview"}
            </h3>
            <canvas
              ref={canvasRef}
              className="w-full rounded-xl border bg-gray-50"
            />
          </div>

          {/* CONTROLS */}
          <div className="space-y-4">
            <select
              value={preset}
              onChange={(e) => applyPreset(e.target.value)}
              className="w-full p-2 rounded-xl border"
            >
              {PRESETS.map((p) => (
                <option key={p.label}>{p.label}</option>
              ))}
            </select>

            <OptionInput label="Width" value={width} onChange={setWidth} />
            <OptionInput label="Height" value={height} onChange={setHeight} />
            <OptionInput
              label="Percentage"
              value={percentage}
              onChange={setPercentage}
            />

            <ToggleSwitch
              label="Keep aspect ratio"
              checked={keepRatio}
              onChange={setKeepRatio}
            />

            <button
              onClick={() => setBeforeMode((v) => !v)}
              className="w-full p-2 rounded-xl bg-gray-200"
            >
              {beforeMode ? "Show Resized" : "Show Original"}
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}

/* ---------------------------------------------
   REUSABLE COMPONENTS
---------------------------------------------- */

function OptionInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: NumberOrEmpty;
  onChange: (v: NumberOrEmpty) => void;
}) {
  return (
    <label className="text-sm font-medium block">
      {label}
      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="mt-1 w-full p-2 rounded-xl border"
      />
    </label>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      />
      {label}
    </label>
  );
}
