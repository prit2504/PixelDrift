// src/app/cookies/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | PixelDrift",
  description: "Cookie policy and how we use cookies on PixelDrift.",
};

export default function CookiePage() {
  return (
    <div className="py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>

      <p className="text-gray-700 dark:text-gray-300 mb-3">
        We use a small number of cookies to store theme preferences and essential session information.
      </p>

      <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
        <li><strong>Essential cookies:</strong> keep you logged in (if applicable) and maintain session state.</li>
        <li><strong>Preference cookies:</strong> store theme (dark/light) and UI preferences.</li>
        <li><strong>Analytics (optional):</strong> if enabled, anonymized metrics help improve the service.</li>
      </ul>

      <p className="mt-4 text-gray-700 dark:text-gray-300">
        To disable cookies, use your browser settings; some features may be reduced.
      </p>
    </div>
  );
}
