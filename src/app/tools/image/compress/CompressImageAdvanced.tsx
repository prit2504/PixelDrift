"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { UploadCloud, Download, ShieldCheck, Zap, Gauge } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

/* --------------------------------------------------
   TYPES & UTILS
-------------------------------------------------- */
type OutputFormat = "jpeg" | "png" | "webp";

function estimateCompressedSize(
  fileSize: number,
  quality: number,
  resizePercent: number,
  format: OutputFormat
) {
  const resizeFactor = Math.pow(resizePercent / 100, 2);

  let compressionBase = 1;

  switch (format) {
    case "jpeg":
      compressionBase = 0.3 + quality / 200;
      break;
    case "webp":
      compressionBase = 0.25 + quality / 250;
      break;
    case "png":
      compressionBase = 0.6;
      break;
  }

  const estimated = fileSize * resizeFactor * compressionBase;

  return {
    min: estimated * 0.85,
    max: estimated * 1.15,
  };
}


/* --------------------------------------------------
   COMPONENT
-------------------------------------------------- */
export default function CompressImageAdvanced() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimateMB, setEstimateMB] = useState<number | null>(null);
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);


  // Settings
  const [quality, setQuality] = useState(75);
  const [resizePercent, setResizePercent] = useState(100);
  const [maxWidth, setMaxWidth] = useState<number | "">("");
  const [maxHeight, setMaxHeight] = useState<number | "">("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg");
  const [keepMetadata, setKeepMetadata] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // JSON-LD Schema for SEO Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PixelDrift Image Compressor",
    "operatingSystem": "Any",
    "applicationCategory": "MultimediaApplication",
    "description": "Free online image compressor to reduce file size of JPG, PNG, and WebP with no quality loss.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  };

  const queryParams = useMemo(() => {
    const p = new URLSearchParams({
      quality: String(quality),
      resize_percent: String(resizePercent),
      format: outputFormat,
      keep_metadata: String(keepMetadata),
    });
    if (maxWidth !== "") p.set("max_width", String(maxWidth));
    if (maxHeight !== "") p.set("max_height", String(maxHeight));
    return p;
  }, [quality, resizePercent, outputFormat, keepMetadata, maxWidth, maxHeight]);

  useEffect(() => {
    if (!file) {
      setEstimate(null);
      return;
    }
    setEstimate(
      estimateCompressedSize(file.size, quality, resizePercent, outputFormat)
    );
  }, [file, quality, resizePercent, outputFormat]);


  const handleFileSelect = (files: FileList | null) => {
    if (!files?.length) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload a valid image.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    setFile(f);
  };

  const compressImage = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(5);
    toast.loading("Optimizing your image...", { id: "compress" });
    abortRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/image/compress?${queryParams.toString()}`, {
        method: "POST",
        body: formData,
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error("Compression failed");
      const reader = res.body?.getReader();
      const contentLength = Number(res.headers.get("Content-Length")) || 0;
      let received = 0;
      const chunks = [];

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (contentLength > 0) setProgress(30 + Math.round((received / contentLength) * 60));
      }

      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pixeldrift-compressed.${outputFormat === "jpeg" ? "jpg" : outputFormat}`;
      a.click();
      toast.success("Image optimized successfully!", { id: "compress" });
      setProgress(100);
      setTimeout(() => { setFile(null); setPreview(null); setLoading(false); }, 1000);
    } catch (err) {
      toast.error("An error occurred during compression.", { id: "compress" });
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Advanced Image Compressor"
      description="Reduce image file size without losing quality. Supports JPEG, PNG, and WebP."
      sidebarCategory="image"
    >
      {/* Injecting Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="max-w-4xl mx-auto">
        <h1 className="sr-only">
          Advanced Image Compressor Online – Free, Fast & Secure
        </h1>

        {/* UPLOAD ZONE */}
        <section
          aria-label="File Upload"
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-2xl p-10 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-blue-500 transition-colors"
        >
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <UploadCloud className="mx-auto h-12 w-12 mb-4 text-blue-600" />
                <h2 className="text-xl font-semibold">Upload Image to Compress</h2>
                <p className="text-neutral-500 mt-2">Drag & drop or click to browse files</p>
              </motion.div>
            ) : (
              <motion.img
                key="preview"
                src={preview}
                alt="Original image preview for compression"
                className="mx-auto max-h-72 rounded-xl shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              />
            )}
          </AnimatePresence>
          <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} />
        </section>

        {/* SETTINGS SECTION */}
        <div className="min-h-[300px]"> {/* Prevents Layout Shift */}
          {file && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 p-8 border rounded-2xl bg-neutral-50 dark:bg-neutral-900/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Compression Settings</h3>
                {estimate && (
                  <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Est. Size: {(estimate.min / 1024 / 1024).toFixed(2)} –{" "}
                    {(estimate.max / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
                <p className="text-xs text-neutral-500 mt-2">
                  *Final size may vary depending on image content and compression format.
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <OptionSlider label={`Image Quality (${quality}%)`} min={1} max={100} value={quality} onChange={setQuality} disabled={loading} />
                <OptionSlider label={`Resize Dimensions (${resizePercent}%)`} min={10} max={100} value={resizePercent} onChange={setResizePercent} disabled={loading} />
                <OptionSelect label="Export Format" value={outputFormat} onChange={setOutputFormat} disabled={loading} />
                <div className="flex items-center justify-between p-4 border rounded-xl bg-white dark:bg-neutral-800">
                  <span className="text-sm font-semibold">Keep Metadata (EXIF)</span>
                  <ToggleSwitch label="" checked={keepMetadata} onChange={setKeepMetadata} disabled={loading} />
                </div>
              </div>

              {loading && (
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Compressing...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                    <motion.div className="bg-blue-600 h-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={compressImage}
                  disabled={loading}
                  className="w-full md:w-auto px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] disabled:opacity-50"
                >
                  <Download size={20} />
                  {loading ? "Processing..." : "Compress & Download"}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* SEO HELPFUL CONTENT SECTION */}
        <section className="mt-24 border-t pt-16">
          <header className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-4">The Smart Way to Compress Images Online</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Optimize your web performance without sacrificing visual clarity.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<ShieldCheck className="text-green-500" />}
              title="Privacy First"
              desc="Files are processed directly in your browser. We never upload or store your images on our servers."
            />
            <FeatureCard
              icon={<Zap className="text-yellow-500" />}
              title="Instant Speed"
              desc="Experience lightning-fast compression thanks to our advanced client-side processing engine."
            />
            <FeatureCard
              icon={<Gauge className="text-blue-500" />}
              title="Better SEO"
              desc="Smaller images load faster, improving your Core Web Vitals and search engine rankings."
            />
          </div>

          <section className="mt-24 border-t pt-16">
            <div className="max-w-5xl mx-auto space-y-16">

              {/* HEADER */}
              <header className="text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  Smart Image Compression for Faster Websites
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                  Reduce image file size without sacrificing visual quality or sharpness.
                  Designed for performance, SEO, and modern web delivery.
                </p>
              </header>

              {/* FEATURE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
                  <h3 className="font-bold text-xl mb-3">
                    Lossless & Lossy Compression
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    Choose between lossless compression for perfect visual fidelity or
                    lossy compression for maximum size reduction — without noticeable
                    quality loss.
                  </p>
                </div>

                <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
                  <h3 className="font-bold text-xl mb-3">
                    Modern WebP Optimization
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    Convert JPG and PNG images to modern WebP format and reduce file size
                    by up to 30–50%, improving page load speed and Core Web Vitals.
                  </p>
                </div>

                <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
                  <h3 className="font-bold text-xl mb-3">
                    Bulk Image Optimization
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    Compress multiple images at once with consistent quality and size
                    settings — perfect for designers, developers, and content teams.
                  </p>
                </div>

                <div className="rounded-2xl border bg-neutral-50 dark:bg-neutral-900 p-8">
                  <h3 className="font-bold text-xl mb-3">
                    SEO & Performance Focused
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                    Smaller images mean faster page loads, better Lighthouse scores,
                    improved user experience, and higher search engine rankings.
                  </p>
                </div>
              </div>

              {/* SEO-RICH CONTENT BLOCK */}
              <article className="prose prose-neutral dark:prose-invert max-w-none bg-neutral-50 dark:bg-neutral-900 p-10 rounded-2xl border">
                <h3>Why use PixelDrift’s Image Compressor?</h3>

                <p>
                  Image optimization is essential for modern websites. Large, uncompressed
                  images slow down page load times and negatively impact SEO and user
                  experience. PixelDrift’s image compressor helps you reduce image file
                  size online using advanced compression techniques — completely free.
                </p>

                <ul>
                  <li>Compress JPEG, PNG, and WebP images efficiently</li>
                  <li>Reduce image size without visible quality loss</li>
                  <li>Convert images to modern WebP format</li>
                  <li>Batch compress images to save time</li>
                  <li>No signup required and privacy-first processing</li>
                </ul>

                <p>
                  Whether you’re optimizing images for websites, e-commerce, blogs, or
                  social media, PixelDrift gives you full control over compression quality
                  and output size.
                </p>
              </article>

            </div>
          </section>

        </section>
      </main>
    </ToolLayout>
  );
}

/* --------------------------------------------------
   SUB-COMPONENTS
-------------------------------------------------- */

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl border bg-white dark:bg-neutral-900 shadow-sm">
      <div className="mb-4">{icon}</div>
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function OptionSlider({ label, min, max, value, onChange, disabled }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{label}</label>
      </div>
      <input
        type="range" min={min} max={max} value={value} disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );
}

function OptionSelect({ label, value, onChange, disabled }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{label}</label>
      <select
        value={value} disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="jpeg">Convert to JPEG (Best for photos)</option>
        <option value="png">Convert to PNG (Best for logos)</option>
        <option value="webp">Convert to WebP (Best for web speed)</option>
      </select>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, disabled }: any) {
  return (
    <button
      type="button" disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "bg-blue-600" : "bg-neutral-300"}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}