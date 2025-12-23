import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

/* ---------------- HELPERS ---------------- */

function parseHexColor(hex: string) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    alpha: 1,
  };
}

/* ---------------- API ---------------- */

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const width = Number(form.get("width"));
    const height = Number(form.get("height"));
    const resizeMode = String(form.get("resize_mode"));
    const bgColor = String(form.get("bg_color"));

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    let image = sharp(inputBuffer).rotate();

    if (resizeMode === "stretch") {
      image = image.resize(width, height);
    } else if (resizeMode === "pad") {
      image = image.resize(width, height, {
        fit: "contain",
        background: parseHexColor(bgColor),
      });
    } else {
      image = image.resize(width, height, {
        fit: "inside",
      });
    }

    const buffer = await image
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Preview resize error:", err);
    return NextResponse.json(
      { error: "Preview failed" },
      { status: 500 }
    );
  }
}
