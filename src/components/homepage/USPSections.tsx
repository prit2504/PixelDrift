"use client"
import {
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoPhonePortraitOutline,
  IoLockClosedOutline,
  IoImageOutline,
} from "react-icons/io5";
import USPAccordion from "@/components/USPaccordion";

export default function USPSection() {
  return (
    <section className="mt-16" aria-labelledby="usp-title">
      <h2
        id="usp-title"
        className="text-3xl md:text-4xl font-bold text-center mb-8"
      >
        Why choose <span className="text-blue-600">PixelDrift</span>?
      </h2>

      <div className="space-y-4 max-w-full mx-auto">
        <USPAccordion
          delay={0}
          icon={IoShieldCheckmarkOutline}
          title="Privacy First"
          text="All processing happens in-browser or via in-memory APIs. Nothing is stored."
        />
        <USPAccordion
          delay={100}
          icon={IoFlashOutline}
          title="Lightning Fast"
          text="Optimized algorithms deliver instant results."
        />
        <USPAccordion
          delay={200}
          icon={IoPhonePortraitOutline}
          title="Mobile Friendly"
          text="Designed to work perfectly on phones, tablets and desktops."
        />
        <USPAccordion
          delay={300}
          icon={IoLockClosedOutline}
          title="Secure Processing"
          text="Encrypted APIs and local processing keep files safe."
        />
        <USPAccordion
          delay={400}
          icon={IoImageOutline}
          title="High Quality Output"
          text="Sharp, clear results across all tools."
        />
      </div>
    </section>
  );
}
