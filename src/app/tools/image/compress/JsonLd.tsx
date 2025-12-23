export default function ImageCompressorJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PixelDrift Image Compressor",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    description:
      "Free online image compressor for JPG, PNG and WebP. Reduce image size without quality loss.",
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
