// src/app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PixelDrift",
  description:
    "Learn how PixelDrift protects your privacy. We process all files securely in-memory and never store your PDFs or images.",
};

export default function PrivacyPolicy() {
  return (
    <div className="py-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6">Privacy Policy</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        At <strong>PixelDrift</strong> we prioritize your privacy. This Privacy Policy explains how
        we collect, use, and safeguard your information when you use our online PDF & Image tools.
      </p>

      {/* Section */}
      <Section title="1. Information We Do Not Collect">
        <p>
          We intentionally design our tools to avoid collecting unnecessary personal data.  
          <strong>We do not store, analyze, or keep copies of your PDF or image files.</strong>
        </p>
        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li>No file contents are saved.</li>
          <li>No processing logs contain your documents.</li>
          <li>No backups or server copies are created.</li>
        </ul>
        <p className="mt-3">
          All file processing happens in-memory and the data disappears when the process ends.
        </p>
      </Section>

      <Section title="2. Information We Collect Automatically">
        <p>
          To improve our service and website performance, we may collect basic non-personal
          information such as:
        </p>
        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li>Browser type (Chrome, Safari, etc.)</li>
          <li>Device information (desktop/mobile)</li>
          <li>Anonymous usage statistics</li>
          <li>Referring URLs</li>
          <li>Basic performance metrics</li>
        </ul>
        <p className="mt-3">
          This data helps us optimize speed and user experience. It cannot identify you personally.
        </p>
      </Section>

      <Section title="3. File Processing & Security">
        <p>
          Your privacy is our top priority. All PDFs and images are processed:
        </p>
        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li><strong>Locally in your browser (client-side)</strong> whenever possible.</li>
          <li><strong>In-memory on our server</strong> for tools that require backend processing.</li>
          <li><strong>Never written to disk</strong> unless explicitly requested for download.</li>
        </ul>
        <p className="mt-3">
          Files are automatically removed from memory after processing, typically within seconds.
        </p>
      </Section>

      <Section title="4. Cookies & Analytics">
        <p>
          We may use lightweight, privacy-friendly analytics to understand tool performance.  
          These do NOT track personal data and do NOT use invasive profiling cookies.
        </p>
        <p className="mt-3">
          Cookies may be used only for:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Remembering dark/light theme</li>
          <li>Saving UI settings (optional)</li>
        </ul>
      </Section>

      <Section title="5. Third-Party Services">
        <p>
          We do not share your files with any third parties.  
          However, we may use secure services for:
        </p>
        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li>Analytics</li>
          <li>Performance monitoring</li>
          <li>Error logging</li>
        </ul>
        <p className="mt-3">
          These services receive anonymous usage data only — never your documents.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          Since we do not store files or personal data, there is no retention period.
          Uploads exist only temporarily in memory, and disappear after processing.
        </p>
      </Section>

      <Section title="7. Children's Privacy">
        <p>
          PixelDrift is not directed to children under the age of 13.  
          We do not knowingly collect personal data from children.
        </p>
      </Section>

      <Section title="8. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li>Know what data we collect (very minimal)</li>
          <li>Request deletion (if any data was ever provided)</li>
          <li>Use our tools with complete anonymity</li>
        </ul>
        <p className="mt-3">
          You may contact us anytime at:  
          <a href="mailto:hello@toolhub.example" className="underline ml-1">
            hello@toolhub.example
          </a>
        </p>
      </Section>

      <Section title="9. Policy Updates">
        <p>
          We may update this Privacy Policy to improve clarity or reflect new features.
          Significant changes will be posted on this page with an updated revision date.
        </p>
      </Section>

      <Section title="10. Contact Us">
        <p>
          If you have questions about this Privacy Policy, contact us at:
          <br />
          <a href="mailto:hello@toolhub.example" className="underline mt-1 inline-block">
            hello@toolhub.example
          </a>
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-3">{title}</h2>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{children}</div>
    </section>
  );
}
