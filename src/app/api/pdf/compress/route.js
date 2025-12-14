import { NextResponse } from "next/server";
import { PDFDocument, PDFDict, PDFName, PDFRawStream } from "pdf-lib";
import sharp from "sharp";

export const runtime = "nodejs";

/* ---------------------------------------------
   HELPERS
---------------------------------------------- */

async function compressImageBuffer(
  buffer,
  dpi,
  quality,
  grayscale
) {
  let img = sharp(buffer).resize({
    width: Math.round((dpi / 300) * 2480), // A4 width @ DPI
    withoutEnlargement: true,
  });

  if (grayscale) img = img.grayscale();

  img = img.jpeg({ quality, mozjpeg: true });

  return new Uint8Array(await img.toBuffer());
}

/* ---------------------------------------------
   API
---------------------------------------------- */

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);

    const quality = Number(searchParams.get("quality") ?? 60);
    const dpi = Number(searchParams.get("image_dpi") ?? 120);
    const grayscale = searchParams.get("grayscale") === "true";
    const removeMetadata =
      searchParams.get("remove_metadata") !== "false";
    const maxPages = Number(searchParams.get("max_pages") ?? 0);

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF uploaded" },
        { status: 400 }
      );
    }

    const inputBytes = new Uint8Array(await file.arrayBuffer());
    const pdfDoc = await PDFDocument.load(inputBytes, {
      ignoreEncryption: true,
    });

    /* ---------------------------------------------
       METADATA
    ---------------------------------------------- */

    if (removeMetadata) {
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");
    }

    const pages = pdfDoc.getPages();
    const processCount =
      maxPages > 0
        ? Math.min(maxPages, pages.length)
        : pages.length;

    /* ---------------------------------------------
       IMAGE COMPRESSION
    ---------------------------------------------- */

    for (let i = 0; i < processCount; i++) {
      const page = pages[i];

      const resources = page.node.Resources();
      if (!(resources instanceof PDFDict)) continue;

      const xObject = resources.lookup(PDFName.of("XObject"));
      if (!(xObject instanceof PDFDict)) continue;

      for (const key of xObject.keys()) {
        const ref = xObject.lookup(key);
        if (!(ref instanceof PDFRawStream)) continue;

        const raw = ref.contents;
        if (!(raw instanceof Uint8Array)) continue;

        try {
          const compressed = await compressImageBuffer(
            raw,
            dpi,
            quality,
            grayscale
          );

          ref.contents = compressed;
        } catch {
          // Unsupported image types are skipped safely
        }
      }
    }

    const outBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    /* ---------------------------------------------
       RESPONSE
    ---------------------------------------------- */

    return new NextResponse(
      new Uint8Array(outBytes),
      {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'attachment; filename="compressed_advanced.pdf"',
          "Content-Length": outBytes.length.toString(),
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("Compress PDF error:", err);
    return NextResponse.json(
      { error: "Failed to compress PDF" },
      { status: 500 }
    );
  }
}
