export default function ResizeImageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PixelDrift Image Resizer",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    description:
      "Free online image resizer to resize JPG, PNG and WebP images using presets or custom dimensions.",
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
