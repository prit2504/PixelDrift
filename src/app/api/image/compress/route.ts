import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

function toBool(value: string | null): boolean {
  return value === "true" || value === "1";
}

type OutputFormat = "jpeg" | "png" | "webp";

function parseFormat(value: string | null): OutputFormat {
  if (value === "png" || value === "webp" || value === "jpeg") {
    return value;
  }
  return "jpeg";
}

/* --------------------------------------------------
   API
-------------------------------------------------- */

export async function POST(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);

    const quality = Number(searchParams.get("quality") ?? 75);
    const resizePercent = Number(searchParams.get("resize_percent") ?? 100);

    const maxWidthParam = searchParams.get("max_width");
    const maxHeightParam = searchParams.get("max_height");

    const maxWidth =
      maxWidthParam !== null ? Number(maxWidthParam) : undefined;
    const maxHeight =
      maxHeightParam !== null ? Number(maxHeightParam) : undefined;

    const format = parseFormat(searchParams.get("format"));
    const keepMetadata = toBool(searchParams.get("keep_metadata"));

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    /* ---------------- READ INPUT ---------------- */

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    let image = sharp(inputBuffer, {
      failOn: "none",
    }).rotate();

    const metadata = await image.metadata();

    /* ---------------- RESIZE % ---------------- */

    if (
      resizePercent < 100 &&
      metadata.width !== undefined &&
      metadata.height !== undefined
    ) {
      const width = Math.round((metadata.width * resizePercent) / 100);
      const height = Math.round((metadata.height * resizePercent) / 100);

      image = image.resize(width, height);
    }

    /* ---------------- MAX WIDTH / HEIGHT ---------------- */

    if (maxWidth !== undefined || maxHeight !== undefined) {
      image = image.resize({
        width: maxWidth,
        height: maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    /* ---------------- METADATA ---------------- */

    if (keepMetadata) {
      image = image.withMetadata();
    }

    /* ---------------- FORMAT + COMPRESSION ---------------- */

    let outputBuffer: Buffer;
    let mime: string;
    let ext: string;

    switch (format) {
      case "png":
        outputBuffer = await image
          .png({ compressionLevel: 9 })
          .toBuffer();
        mime = "image/png";
        ext = "png";
        break;

      case "webp":
        outputBuffer = await image
          .webp({ quality })
          .toBuffer();
        mime = "image/webp";
        ext = "webp";
        break;

      case "jpeg":
      default:
        outputBuffer = await image
          .jpeg({ quality, mozjpeg: true })
          .toBuffer();
        mime = "image/jpeg";
        ext = "jpg";
        break;
    }

    /* ---------------- RESPONSE ---------------- */

    return new NextResponse(
  new Uint8Array(outputBuffer),
  {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="compressed.${ext}"`,
      "Content-Length": outputBuffer.length.toString(),
      "Cache-Control": "no-store",
    },
  }
);

  } catch (err) {
    console.error("Compression error:", err);
    return NextResponse.json(
      { error: "Image compression failed" },
      { status: 500 }
    );
  }
}
