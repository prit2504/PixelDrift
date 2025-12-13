"use client";

import Link from "next/link";
import { Facebook, Twitter, Github, Mail } from "lucide-react";

export default function Footer() {

  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-10">

        {/* Top section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Branding */}
          <div>
            <h3 className="text-xl font-bold mb-1">PixelDrift</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              The smart, secure and fast way to work with PDF & Image files.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/about"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              About
            </Link>

            <Link
              href="/privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Terms of Service
            </Link>

            <Link
              href="/contact"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Contact
            </Link>

            <Link
              href="/faq"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Help / FAQ
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200 dark:border-neutral-800" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">

          {/* Copyright */}
          <p>© 2025 PixelDrift — All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="/contact"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
