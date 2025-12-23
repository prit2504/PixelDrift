export default function ImageConvertJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PixelDrift Image Converter",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    description:
      "Free online image converter to convert JPG, PNG, WebP and TIFF images in batch.",
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
