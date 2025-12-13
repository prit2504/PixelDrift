"use client";

import { useState } from "react";
import { Mail, User, MessageSquare, CheckCircle } from "lucide-react";

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const subject = encodeURIComponent(
        `PixelDrift contact from ${name || "visitor"}`
      );
      const body = encodeURIComponent(
        `${message}\n\nFrom: ${name}\nEmail: ${email}`
      );

      window.location.href = `mailto:hello@toolhub.example?subject=${subject}&body=${body}`;
      setSent(true);
    } catch {
      alert(
        "Unable to open your email client — please email hello@toolhub.example directly."
      );
    }
  };

  return (
    <div className="py-12 max-w-2xl mx-auto">

      {/* HERO */}
      <h1 className="text-4xl font-extrabold tracking-tight mb-3">
        Get in <span className="text-blue-600">Touch</span>
      </h1>

      <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed">
        Have a suggestion, issue, or business inquiry? We’d love to hear from you.
      </p>

      {/* SUCCESS MESSAGE */}
      {sent ? (
        <div className="p-5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex gap-3 items-start">
          <CheckCircle className="text-green-600 dark:text-green-300 mt-1" size={24} />
          <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
            Your email client opened successfully!  
            If you didn’t send your message, you can also reach us directly at:  
            <br />
            <a href="mailto:hello@toolhub.example" className="underline">
              hello@toolhub.example
            </a>
          </p>
        </div>
      ) : (
        /* CONTACT FORM */
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm"
        >
          {/* Name */}
          <div>
            <label className="text-sm font-medium block mb-1">Name</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <User className="text-gray-500 dark:text-gray-400" size={18} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <Mail className="text-gray-500 dark:text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium block mb-1">Message</label>
            <div className="flex gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
              <MessageSquare className="text-gray-500 dark:text-gray-400 mt-1" size={18} />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
                required
                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 resize-none h-32"
              />
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition w-full md:w-auto"
            >
              Send Message (opens email client)
            </button>

            <p className="text-xs text-gray-500 mt-3">
              Prefer emailing directly?  
              <a href="mailto:hello@toolhub.example" className="underline ml-1">
                hello@toolhub.example
              </a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
