export default function CompressPDFJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PixelDrift PDF Compressor",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description:
      "Free online PDF compressor to reduce PDF file size with advanced quality and DPI controls.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
