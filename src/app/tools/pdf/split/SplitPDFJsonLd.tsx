export default function SplitPDFJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PixelDrift PDF Splitter",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description:
      "Free online PDF splitter to extract pages or split PDF files by range.",
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
