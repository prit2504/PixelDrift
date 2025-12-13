// src/app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | PixelDrift",
  description:
    "Read the official Terms of Service for PixelDrift, covering usage rules, limitations, and legal disclaimers.",
};

export default function TermsPage() {
  return (
    <div className="py-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-6">Terms of Service</h1>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
        By accessing or using <strong>PixelDrift</strong>, you agree to these Terms
        of Service. If you do not agree, please discontinue use of PixelDrift and its tools.
      </p>

      <Section title="1. Acceptance of Terms">
        <p>
          These Terms govern your use of PixelDrift’s PDF and Image tools. By using
          the website, you confirm that you are legally allowed to enter into this
          agreement under your local laws.
        </p>
      </Section>

      <Section title="2. Use of Our Tools">
        <p>You agree that you will NOT use PixelDrift for:</p>

        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li>Uploading illegal, harmful, copyrighted, or abusive material</li>
          <li>Violating intellectual property or privacy rights</li>
          <li>Automated scraping or misuse of our service</li>
          <li>Attempting to reverse-engineer or disrupt the platform</li>
        </ul>

        <p className="mt-3">
          We reserve the right to limit or block access for misuse.
        </p>
      </Section>

      <Section title="3. File Processing & Privacy">
        <p>
          PixelDrift processes your PDF and image files securely:
        </p>
        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li><strong>No files are stored permanently.</strong></li>
          <li>Files are processed in-memory and removed once completed.</li>
          <li>Some tools process files locally in your browser (client-side).</li>
        </ul>
        <p className="mt-3">
          For complete details, refer to our{" "}
          <a href="/privacy" className="underline text-blue-600">
            Privacy Policy
          </a>.
        </p>
      </Section>

      <Section title="4. Accuracy of Results">
        <p>
          We strive to ensure accurate, high-quality file conversions and
          compressions. However, PixelDrift does not guarantee:
        </p>

        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li>That results will always be error-free or perfectly formatted</li>
          <li>That files will retain original metadata</li>
          <li>That processing will meet professional publishing requirements</li>
        </ul>

        <p className="mt-3">
          Results may vary depending on file complexity, corruption, or format.
        </p>
      </Section>

      <Section title="5. No Warranty">
        <p>
          PixelDrift is provided on an <strong>“as-is” and “as-available”</strong>{" "}
          basis. We make no warranties, expressed or implied, including but not
          limited to:
        </p>

        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li>Availability or uptime</li>
          <li>Accuracy of output files</li>
          <li>Suitability for commercial workflows</li>
        </ul>
      </Section>

      <Section title="6. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, PixelDrift is not liable for any
          damages resulting from:
        </p>

        <ul className="list-disc ml-6 mt-3 space-y-1">
          <li>Loss of data or corrupted documents</li>
          <li>Errors in output files</li>
          <li>Downtime or service interruptions</li>
          <li>Unauthorized third-party access</li>
          <li>Use of processed files for business or legal purposes</li>
        </ul>

        <p className="mt-3">
          You accept full responsibility for verifying file accuracy before use.
        </p>
      </Section>

      <Section title="7. Third-Party Links">
        <p>
          PixelDrift may include links to external websites. These are provided for
          convenience only. We are not responsible for the content, security, or
          practices of third-party sites.
        </p>
      </Section>

      <Section title="8. Intellectual Property">
        <p>
          All branding, website design, and tool UI are the property of PixelDrift.
          You may not copy, distribute, or modify any part of the platform.
        </p>
      </Section>

      <Section title="9. Service Changes">
        <p>
          We may modify, suspend, or discontinue any tool or feature without
          notice. We are not liable for any impact this may cause.
        </p>
      </Section>

      <Section title="10. Termination">
        <p>
          We may suspend or block your access at any time if you violate these
          Terms, attempt to abuse resources, or compromise system integrity.
        </p>
      </Section>

      <Section title="11. Governing Law">
        <p>
          These Terms are governed by applicable international and local laws.
          Any disputes must be resolved in courts with proper jurisdiction.
        </p>
      </Section>

      <Section title="12. Changes to These Terms">
        <p>
          We may revise these Terms periodically. Continuing to use PixelDrift
          after updates constitutes acceptance of the new Terms.
        </p>
      </Section>

      <Section title="13. Contact Us">
        <p>
          For questions about these Terms, email us at:{" "}
          <a href="mailto:hello@toolhub.example" className="underline">
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
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
