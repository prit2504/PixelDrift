"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout"; 
import { UploadCloud, DownloadCloud, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";

/* ---------------- TYPES & CONSTANTS ---------------- */

type ResizeMode = "fit" | "stretch" | "pad";

interface Preset {
  label: string;
  w: number;
  h: number;
}

const DEFAULT_WIDTH = 1080;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_BG_COLOR = "#000000"; 
const PRIMARY_COLOR_CLASSES = "bg-blue-600 hover:bg-blue-500 text-white";
const SECONDARY_COLOR_CLASSES = "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600";

const PRESETS: Preset[] = [
  { label: "Instagram Square", w: 1080, h: 1080 },
  { label: "Facebook Cover", w: 820, h: 312 },
  { label: "Twitter Banner", w: 1600, h: 900 },
  { label: "YouTube HD", w: 1280, h: 720 },
  { label: "HD (1080p)", w: 1920, h: 1080 },
];

/* ---------------- COMPONENT ---------------- */

export default function ResizeImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [mode, setMode] = useState<ResizeMode>("fit");
  const [bg, setBg] = useState(DEFAULT_BG_COLOR);

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // --- REFS ---
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Store the actual loaded image object to allow quick redraws
  const loadedImageRef = useRef<HTMLImageElement | null>(null); 
  // ------------

  /* ---------------- FILE UPLOAD ---------------- */

  const onFiles = useCallback((list: FileList | null) => {
    if (!list) return;

    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));

    if (!imgs.length) {
      toast.error("Please upload valid images");
      return;
    }

    setFiles(imgs);
    
    // Cleanup old URL and image ref
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    loadedImageRef.current = null;

    const newUrl = URL.createObjectURL(imgs[0]);
    setPreviewUrl(newUrl);
    
    // Reset active preset when a new image is uploaded
    setActivePreset(null);
  }, [previewUrl]);


  /* ---------------- CANVAS DRAWING LOGIC ---------------- */
  
  // This function is memoized and depends on all resizing parameters
  const drawToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ow = img.width;
    const oh = img.height;

    // 1. Set the canvas's internal resolution (Crucial for high-quality resize)
    canvas.width = width;
    canvas.height = height;

    let rw = width;
    let rh = height;

    // 2. Calculate drawing dimensions based on mode (Fit, Stretch, Pad)
    if (mode !== "stretch") {
      const r = ow / oh;
      if (width / height > r) {
        rh = height;
        rw = Math.round(height * r);
      } else {
        rw = width;
        rh = Math.round(width / r);
      }
    }

    ctx.clearRect(0, 0, width, height);

    // 3. Draw Background (pad)
    if (mode === "pad") {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    }

    // 4. Calculate position for centering (fit/pad)
    const x = (width - rw) / 2;
    const y = (height - rh) / 2;

    // 5. Draw the image onto the canvas
    ctx.drawImage(img, x, y, rw, rh);
    
  }, [width, height, mode, bg]);


  /* ---------------- EFFECT 1: IMAGE LOADING (Runs ONLY on new file upload) ---------------- */

  useEffect(() => {
    if (!previewUrl) return;

    const img = new Image();
    img.src = previewUrl;

    const handleLoad = () => {
      // Store the loaded image object for quick redraws
      loadedImageRef.current = img; 
      drawToCanvas(img);
      // Clean up the temporary URL only after image object is ready
      URL.revokeObjectURL(previewUrl); 
    };

    // Make the loading robust against fast Blob URL loading
    if (img.complete) {
        handleLoad();
    } else {
        img.onload = handleLoad;
        img.onerror = () => {
            toast.error("Failed to load image into preview.");
        };
    }

    // Cleanup: Remove the handlers
    return () => {
        img.onload = null;
        img.onerror = null;
        // Do NOT revoke previewUrl here, it's handled in handleLoad
    };

  }, [previewUrl, drawToCanvas]); 
  // NOTE: drawToCanvas is intentionally a dependency here so the first draw uses the latest settings.


  /* ---------------- EFFECT 2: REDRAWING (Runs on parameter change) ---------------- */

  useEffect(() => {
    // FIX: Redraw whenever width, height, mode, or bg changes, 
    // but only if an image is already loaded and ready.
    if (loadedImageRef.current && canvasRef.current) {
      drawToCanvas(loadedImageRef.current);
    }
  }, [width, height, mode, bg, drawToCanvas]);


  /* ---------------- DOWNLOAD HANDLER ---------------- */

  const downloadResized = useCallback(async () => {
    if (!files.length) return toast.error("Upload images first");

    setLoading(true);
    setProgress(5);

    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("width", String(width));
    form.append("height", String(height));
    form.append("resize_mode", mode);
    form.append("bg_color", mode === "pad" ? bg : DEFAULT_BG_COLOR);
    form.append("out_format", "jpeg");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) throw new Error("API URL is not configured.");

      const res = await fetch(
        `${API_URL}/image/resize-image`,
        { method: "POST", body: form, cache: 'no-store' }
      );

      if (!res.ok || !res.body) throw new Error(await res.text() || "Server error.");

      const reader = res.body.getReader();
      const total = Number(res.headers.get("Content-Length")) || 0;

      let received = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (total) {
            setProgress(10 + Math.round((received / total) * 85));
          } else {
            setProgress((prev) => Math.min(prev + 1, 95));
          }
        }
      }

      const blob = new Blob(chunks as BlobPart[]);

      setProgress(100);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files.length === 1 ? "resized.jpg" : "resized-images.zip";
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
      toast.success("Resize completed");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error(`Resize failed: ${errorMessage}`);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [files, width, height, mode, bg]);

  /* ---------------- UI HELPERS ---------------- */

  const handlePresetClick = (p: Preset) => {
    setWidth(p.w);
    setHeight(p.h);
    setActivePreset(p.label);
  };
  
  const handleCustomSizeChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    setter(Number(value));
    setActivePreset(null);
  };

  /* ---------------- UI RENDER ---------------- */

  return (
    <ToolLayout
      title="Resize Image"
      description="Resize images with presets and background padding."
      sidebarCategory="image"
      
    >
      {/* HOW TO USE */}
      <div className="mb-6 rounded-xl border border-blue-800 bg-blue-950 p-4 text-sm text-blue-300">
        <b>How to use:</b>
        <ol className="list-decimal ml-5 mt-2 space-y-1">
          <li>Upload image(s)</li>
          <li>Select a preset or enter custom size</li>
          <li>Choose resize mode</li>
          <li>Review the scaled preview of the resized image (updates instantly!)</li>
          <li>Download resized image(s)</li>
        </ol>
      </div>

      {/* UPLOAD */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-600 rounded-2xl p-10 text-center cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
      >
        <UploadCloud className="mx-auto h-10 w-10 mb-2 text-blue-400" />
        <p className="text-gray-300">Click or drag images here</p>
        {files.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">{files.length} image(s) selected.</p>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>
      
      {/* OPTIONS */}
      {files.length > 0 && (
        <div className="mt-8 space-y-6">
            <h3 className="font-semibold text-lg border-b border-gray-700 pb-2 text-gray-200">Resize Parameters</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Width (px)</label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => handleCustomSizeChange(setWidth, e.target.value)}
                        className={`p-3 border rounded-xl w-full ${SECONDARY_COLOR_CLASSES} focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Width"
                        min="1"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Height (px)</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => handleCustomSizeChange(setHeight, e.target.value)}
                        className={`p-3 border rounded-xl w-full ${SECONDARY_COLOR_CLASSES} focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Height"
                        min="1"
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-400">Resize Mode</label>
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value as ResizeMode)}
                        className={`p-3 border rounded-xl w-full ${SECONDARY_COLOR_CLASSES} appearance-none`}
                    >
                        <option value="fit">Fit (Keep ratio, max size)</option>
                        <option value="stretch">Stretch (Ignore ratio, fill box)</option>
                        <option value="pad">Pad (Keep ratio, fill empty space with color)</option>
                    </select>
                </div>

                {mode === "pad" && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-400">Background Color (Pad Mode)</label>
                        <div className="flex items-center p-2 border border-gray-600 rounded-xl bg-gray-700">
                            <input
                                type="color"
                                value={bg}
                                onChange={(e) => setBg(e.target.value)}
                                className="w-10 h-10 border-none p-0 cursor-pointer mr-3"
                            />
                            <span className="text-sm font-mono text-gray-300">{bg}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* PRESETS */}
      <div className="mt-8">
        <h3 className="font-semibold mb-3 text-gray-200">Popular Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePresetClick(p)}
              className={`rounded-xl border p-3 text-sm transition text-left ${
                activePreset === p.label
                  ? "border-blue-600 bg-blue-900 text-blue-300 ring-2 ring-blue-700"
                  : "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="font-medium">{p.label}</div>
              <div className="text-xs text-gray-500">
                {p.w} × {p.h} px
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PREVIEW */}
      {files.length > 0 && (
        <div className="mt-10">
          <h3 className="font-semibold mb-3 text-gray-200">Resized Preview</h3>
          
          <div className="relative max-w-full overflow-hidden border-4 w-70 border-gray-700 rounded-xl shadow-2xl bg-gray-950">
            {/* Show canvas only when image data is ready */}
            {loadedImageRef.current ? (
                <canvas
                    ref={canvasRef}
                    className="block w-full h-auto"
                />
            ) : (
                // Placeholder while the image loads
                <div className="flex justify-center items-center h-48 text-gray-500">
                    <ImageIcon className="w-8 h-8 mr-2"/>
                    Loading image for preview...
                </div>
            )}
          </div>
        </div>
      )}

      {/* PROGRESS */}
      {loading && (
        <div className="mt-6 w-full">
            <p className="text-sm text-gray-400 mb-1">Processing {files.length} images...</p>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
        </div>
      )}

      {/* DOWNLOAD */}
      {files.length > 0 && (
        <div className="mt-8">
          <button
            onClick={downloadResized}
            disabled={loading}
            className={`px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 w-full sm:w-auto transition-colors ${
                loading ? "bg-blue-400 cursor-not-allowed" : PRIMARY_COLOR_CLASSES
            }`}
          >
            <DownloadCloud size={20} />
            {loading ? `Processing... (${Math.round(progress)}%)` : "Download Resized Images"}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}