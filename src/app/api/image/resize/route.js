import { NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";

export const runtime = "nodejs";

/* ---------------- HELPERS ---------------- */

function parseHexColor(hex) {
  if (hex === "transparent") {
    return { r: 0, g: 0, b: 0, alpha: 0 };
  }

  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    alpha: 1,
  };
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/* ---------------- API ---------------- */

export async function POST(req) {
  try {
    const form = await req.formData();

    const files = form
      .getAll("files")
      .filter((f) => f instanceof File);

    const width = Number(form.get("width"));
    const height = Number(form.get("height"));
    const resizeMode = String(form.get("resize_mode") || "fit");
    const bgColor = String(form.get("bg_color") || "#000000");
    const outFormat = String(form.get("out_format") || "jpeg");

    if (!files.length || !width || !height) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const outputs = [];

    /* ---------------- PROCESS FILES ---------------- */

    for (const file of files) {
      const inputBuffer = Buffer.from(await file.arrayBuffer());
      let image = sharp(inputBuffer).rotate();

      /* ---------------- RESIZE LOGIC ---------------- */

      if (resizeMode === "stretch") {
        image = image.resize(width, height);
      } else if (resizeMode === "pad") {
        image = image.resize(width, height, {
          fit: "contain",
          background: parseHexColor(bgColor),
        });
      } else {
        // "fit"
        image = image.resize(width, height, {
          fit: "inside",
        });
      }

      /* ---------------- FORMAT ---------------- */

      let buffer;

      switch (outFormat) {
        case "png":
          buffer = await image.png().toBuffer();
          break;

        case "webp":
          buffer = await image.webp({ quality: 85 }).toBuffer();
          break;

        default:
          buffer = await image.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
      }

      const baseName = sanitizeFilename(
        file.name.replace(/\.[^/.]+$/, "")
      );

      outputs.push({
        name: `${baseName}-resized.${outFormat}`,
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
            "Content-Type": `image/${outFormat}`,
            "Content-Disposition": `attachment; filename="${out.name}"`,
            "Content-Length": out.buffer.length.toString(),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    /* ---------------- MULTI FILE → ZIP ---------------- */

    const zip = new JSZip();
    outputs.forEach((f) => zip.file(f.name, f.buffer));

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
    });

    return new NextResponse(
      new Uint8Array(zipBuffer),
      {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition":
            'attachment; filename="resized-images.zip"',
          "Content-Length": zipBuffer.length.toString(),
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("Resize error:", err);
    return NextResponse.json(
      { error: "Image resize failed" },
      { status: 500 }
    );
  }
}
