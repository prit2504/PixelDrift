export default function MergePDFJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PixelDrift PDF Merger",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description:
      "Free online PDF merger to combine multiple PDF files into a single document.",
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
