export default function ImageToPDFJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PixelDrift Image to PDF Converter",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description:
      "Free online image to PDF converter with advanced layout, DPI and page controls.",
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
