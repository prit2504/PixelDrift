import { NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";

export const runtime = "nodejs";

/* --------------------------------------------------
   CONSTANTS
-------------------------------------------------- */

const FORMAT_MAP = {
  jpeg: { mime: "image/jpeg", ext: "jpg" },
  png: { mime: "image/png", ext: "png" },
  webp: { mime: "image/webp", ext: "webp" },
  bmp: { mime: "image/bmp", ext: "bmp" },
  tiff: { mime: "image/tiff", ext: "tiff" },
};

/* --------------------------------------------------
   UTILS
-------------------------------------------------- */

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function parseFormat(value) {
  return value && FORMAT_MAP[value] ? value : null;
}

/* --------------------------------------------------
   API
-------------------------------------------------- */

export async function POST(req) {
  try {
    const form = await req.formData();

    const files = form
      .getAll("files")
      .filter((f) => f instanceof File);

    const outFormat = parseFormat(form.get("out_format"));
    const renameTo =
      typeof form.get("rename_to") === "string"
        ? form.get("rename_to")
        : null;

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    if (!outFormat) {
      return NextResponse.json(
        { error: "Unsupported output format" },
        { status: 400 }
      );
    }

    const { mime, ext } = FORMAT_MAP[outFormat];
    const outputs = [];

    /* ---------------- PROCESS FILES ---------------- */

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const inputBuffer = Buffer.from(await file.arrayBuffer());

      let image = sharp(inputBuffer).rotate();

      // JPEG cannot keep transparency
      if (outFormat === "jpeg") {
        image = image.flatten({ background: "#ffffff" });
      }

      let buffer;

      switch (outFormat) {
        case "png":
          buffer = await image.png().toBuffer();
          break;

        case "webp":
          buffer = await image.webp({ quality: 85 }).toBuffer();
          break;

        case "bmp":
          buffer = await image.toFormat("bmp").toBuffer();
          break;

        case "tiff":
          buffer = await image.tiff().toBuffer();
          break;

        default:
          buffer = await image
            .jpeg({ quality: 85, mozjpeg: true })
            .toBuffer();
      }

      const baseName = renameTo
        ? `${sanitizeFilename(renameTo)}${
            files.length > 1 ? `_${i + 1}` : ""
          }`
        : sanitizeFilename(
            file.name.replace(/\.[^/.]+$/, "")
          );

      outputs.push({
        name: `${baseName}.${ext}`,
        buffer,
      });
    }

    /* ---------------- SINGLE FILE ---------------- */

    if (outputs.length === 1) {
      const out = outputs[0];

      return new NextResponse(
        new Uint8Array(out.buffer),
        {
          headers: {
            "Content-Type": mime,
            "Content-Disposition": `attachment; filename="${out.name}"`,
            "Content-Length": out.buffer.length.toString(),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    /* ---------------- MULTIPLE → ZIP ---------------- */

    const zip = new JSZip();
    outputs.forEach((o) => zip.file(o.name, o.buffer));

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
    });

    return new NextResponse(
      new Uint8Array(zipBuffer),
      {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition":
            'attachment; filename="converted_images.zip"',
          "Content-Length": zipBuffer.length.toString(),
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("Convert error:", err);
    return NextResponse.json(
      { error: "Image conversion failed" },
      { status: 500 }
    );
  }
}
