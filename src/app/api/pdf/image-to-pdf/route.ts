import { NextResponse } from "next/server";
import { PDFDocument, PageSizes, rgb } from "pdf-lib";

export const runtime = "nodejs";

/* ---------------------------------------------
   TYPES
---------------------------------------------- */

type PageSize = "A4" | "LETTER" | "FIT";
type Orientation = "portrait" | "landscape";
type FitMode = "contain" | "cover";

/* ---------------------------------------------
   HELPERS
---------------------------------------------- */

function getPageSize(
  size: PageSize,
  orientation: Orientation,
  imgWidth?: number,
  imgHeight?: number
): [number, number] {
  let w: number;
  let h: number;

  if (size === "LETTER") {
    [w, h] = PageSizes.Letter;
  } else if (size === "A4") {
    [w, h] = PageSizes.A4;
  } else {
    // FIT → match image size (fallback to A4)
    w = imgWidth ?? PageSizes.A4[0];
    h = imgHeight ?? PageSizes.A4[1];
  }

  if (orientation === "landscape") {
    return [Math.max(w, h), Math.min(w, h)];
  }

  return [Math.min(w, h), Math.max(w, h)];
}

/* ---------------------------------------------
   API
---------------------------------------------- */

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const pageSize = (searchParams.get("page_size") ??
      "A4") as PageSize;
    const orientation = (searchParams.get("orientation") ??
      "portrait") as Orientation;
    const margin = Number(searchParams.get("margin") ?? 0);
    const dpi = Number(searchParams.get("dpi") ?? 120);
    const fitMode = (searchParams.get("fit_mode") ??
      "contain") as FitMode;

    const form = await req.formData();
    const files = form.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No images uploaded" },
        { status: 400 }
      );
    }

    const pdf = await PDFDocument.create();

    /* ---------------------------------------------
       PROCESS IMAGES (ORDER PRESERVED)
    ---------------------------------------------- */

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const ext = file.type;

      let image;
      if (ext.includes("png")) {
        image = await pdf.embedPng(bytes);
      } else {
        image = await pdf.embedJpg(bytes);
      }

      // Convert pixels → points using DPI
      const imgW = (image.width / dpi) * 72;
      const imgH = (image.height / dpi) * 72;

      const [pageW, pageH] = getPageSize(
        pageSize,
        orientation,
        imgW,
        imgH
      );

      const page = pdf.addPage([pageW, pageH]);

      const availableW = pageW - margin * 2;
      const availableH = pageH - margin * 2;

      let drawW = availableW;
      let drawH = availableH;

      const imgRatio = imgW / imgH;
      const pageRatio = availableW / availableH;

      if (fitMode === "contain") {
        if (imgRatio > pageRatio) {
          drawH = drawW / imgRatio;
        } else {
          drawW = drawH * imgRatio;
        }
      } else {
        // cover
        if (imgRatio > pageRatio) {
          drawW = drawH * imgRatio;
        } else {
          drawH = drawW / imgRatio;
        }
      }

      const x = (pageW - drawW) / 2;
      const y = (pageH - drawH) / 2;

      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageW,
        height: pageH,
        color: rgb(1, 1, 1),
      });

      page.drawImage(image, {
        x,
        y,
        width: drawW,
        height: drawH,
      });
    }

    const pdfBytes = await pdf.save();

    /* ---------------------------------------------
       RESPONSE
    ---------------------------------------------- */

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="converted_images.pdf"',
        "Content-Length": pdfBytes.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Image to PDF error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
