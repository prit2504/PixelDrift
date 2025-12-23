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

  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const previewAbortRef = useRef<AbortController | null>(null);


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

  useEffect(() => {
    if (!files.length) return;

    const timeout = setTimeout(async () => {
      setPreviewLoading(true);

      previewAbortRef.current?.abort();
      previewAbortRef.current = new AbortController();

      try {
        const form = new FormData();
        form.append("file", files[0]);
        form.append("width", String(width));
        form.append("height", String(height));
        form.append("resize_mode", mode);
        form.append("bg_color", mode === "pad" ? bg : DEFAULT_BG_COLOR);

        const res = await fetch("/api/image/resize/preview", {
          method: "POST",
          body: form,
          signal: previewAbortRef.current.signal,
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Preview failed");

        const blob = await res.blob();
        if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);

        setPreviewBlobUrl(URL.createObjectURL(blob));
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          toast.error("Preview update failed");
        }
      } finally {
        setPreviewLoading(false);
      }
    }, 350); // ⏱ debounce

    return () => clearTimeout(timeout);
  }, [files, width, height, mode, bg]);

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


      const res = await fetch(
        "/api/image/resize",
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
      <h1 className="sr-only">
        Resize Image Online – Free, Fast & High Quality
      </h1>

      {/* HOW TO USE */}
      <section className="mb-10 rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-6">
        <h2 className="font-bold mb-3 text-lg">How to Resize Images</h2>
        <ol className="list-decimal ml-5 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
          <li>Upload one or more images</li>
          <li>Select preset or enter custom size</li>
          <li>Choose resize mode (Fit, Stretch or Pad)</li>
          <li>Preview resized image instantly</li>
          <li>Download resized image(s)</li>
        </ol>
      </section>


      {/* UPLOAD */}
      <section
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-2xl p-10 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-blue-500 transition"
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
      </section>

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
              className={`rounded-xl border p-3 text-sm transition text-left ${activePreset === p.label
                ? "border-blue-600 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"

                : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"

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
          <h3 className="font-semibold mb-3 text-gray-200">
            Live Backend Preview
          </h3>

          <div className="relative max-w-100 max-h-100 overflow-hidden border-4  border-gray-700 rounded-xl shadow-2xl bg-gray-950">
            {previewLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent" />
              </div>
            )}

            {previewBlobUrl ? (
              <img
                src={previewBlobUrl}
                alt="Resized image preview"
                className="rounded-xl shadow-lg block w-full h-auto"
              />
            ) : (
              <div className="text-neutral-500 flex items-center">
                <ImageIcon className="mr-2" />
                Preview will appear here
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
            className={`px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 w-full sm:w-auto transition-colors ${loading ? "bg-blue-400 cursor-not-allowed" : PRIMARY_COLOR_CLASSES
              }`}
          >
            <DownloadCloud size={20} />
            {loading ? `Processing... (${Math.round(progress)}%)` : "Download Resized Images"}
          </button>
        </div>
      )}

      <section className="mt-24 border-t pt-16">
  <div className="max-w-5xl mx-auto space-y-16">

    {/* HEADER */}
    <header className="text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
        Resize Images Online Without Quality Loss
      </h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
        Resize images precisely for websites, social media, email, and design
        workflows — fast, flexible, and high quality.
      </p>
    </header>

    {/* FEATURE GRID */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
        <h3 className="font-bold text-xl mb-3">
          Precision Image Resizing
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Resize images using exact width and height values or smart presets
          without stretching or distorting the original image.
        </p>
      </div>

      <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
        <h3 className="font-bold text-xl mb-3">
          Smart Aspect Ratio Control
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Maintain original proportions automatically or pad background color
          to fit required dimensions perfectly.
        </p>
      </div>

      <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
        <h3 className="font-bold text-xl mb-3">
          Batch Image Resizing
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Resize multiple images at once with consistent sizing rules —
          ideal for content teams and designers.
        </p>
      </div>

      <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
        <h3 className="font-bold text-xl mb-3">
          Performance & SEO Optimized
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Properly sized images load faster, improve Core Web Vitals,
          and enhance search engine rankings.
        </p>
      </div>
    </div>

    {/* SEO-RICH CONTENT BLOCK */}
    <article className="prose prose-neutral dark:prose-invert max-w-none bg-neutral-50 dark:bg-neutral-900 p-10 rounded-2xl border">
      <h3>Why use PixelDrift’s Image Resizer?</h3>

      <p>
        Incorrect image dimensions can slow down websites, break layouts,
        and reduce user engagement. PixelDrift’s image resizer helps you
        resize images online using smart presets or custom dimensions —
        completely free and easy to use.
      </p>

      <ul>
        <li>Resize images without distortion or quality loss</li>
        <li>Maintain aspect ratio or pad background color</li>
        <li>Batch resize multiple images efficiently</li>
        <li>Optimize images for web performance and SEO</li>
        <li>No signup required and privacy-first processing</li>
      </ul>

      <p>
        Whether you’re preparing images for social media, websites, emails,
        or marketing campaigns, PixelDrift gives you precise control over
        image dimensions and output quality.
      </p>
    </article>

  </div>
</section>

    </ToolLayout>
  );
}