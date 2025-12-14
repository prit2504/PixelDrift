import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";

/* --------------------------------------------------
   UTILS
-------------------------------------------------- */

function parsePageRanges(input: string, totalPages: number): number[] {
  if (input === "all") {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages = new Set<number>();

  const parts = input.split(",");

  for (const part of parts) {
    const p = part.trim();

    // Range: 1-5
    if (p.includes("-")) {
      const [startStr, endStr] = p.split("-");
      const start = Number(startStr);
      const end = Number(endStr);

      if (isNaN(start) || isNaN(end)) continue;

      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= totalPages) {
          pages.add(i - 1); // zero-based
        }
      }
    }
    // Single page
    else {
      const num = Number(p);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        pages.add(num - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/* --------------------------------------------------
   API
-------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pagesParam = searchParams.get("pages") || "all";

    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    /* ---------------- LOAD PDF ---------------- */

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const sourcePdf = await PDFDocument.load(inputBuffer);
    const totalPages = sourcePdf.getPageCount();

    /* ---------------- PARSE PAGE RANGES ---------------- */

    const pageIndexes = parsePageRanges(pagesParam, totalPages);

    if (pageIndexes.length === 0) {
      return NextResponse.json(
        { error: "No valid pages selected" },
        { status: 400 }
      );
    }

    /* ---------------- CREATE OUTPUT PDF ---------------- */

    const outputPdf = await PDFDocument.create();
    const pages = await outputPdf.copyPages(sourcePdf, pageIndexes);

    pages.forEach((p) => outputPdf.addPage(p));

    const outputBytes = await outputPdf.save();

    /* ---------------- RESPONSE ---------------- */

    return new NextResponse(Buffer.from(outputBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="extracted_pages.pdf"',
        "Content-Length": outputBytes.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Split PDF error:", err);

    return NextResponse.json(
      { error: "Failed to split PDF" },
      { status: 500 }
    );
  }
}
