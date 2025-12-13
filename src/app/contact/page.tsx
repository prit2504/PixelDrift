import { Suspense } from "react";
import ContactClient from "./ContactPage";

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center">Loading…</div>}>
      <ContactClient />
    </Suspense>
  );
}
