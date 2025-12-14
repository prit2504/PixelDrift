import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";

/* --------------------------------------------------
   API
-------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];

    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: "At least two PDF files are required." },
        { status: 400 }
      );
    }

    /* ---------------- CREATE MERGED PDF ---------------- */

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);

      const pages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();

    /* ---------------- RESPONSE ---------------- */

    return new NextResponse(Buffer.from(mergedBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
        "Content-Length": mergedBytes.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Merge PDF error:", err);

    return NextResponse.json(
      { error: "Failed to merge PDF files." },
      { status: 500 }
    );
  }
}
