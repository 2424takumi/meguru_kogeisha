"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/areas", label: "産地を探す" },
  { href: "/stories", label: "物語を読む" },
  { href: "/about", label: "めぐる工芸舎について" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-brand-100/80 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" aria-label="めぐる工芸舎" className="flex items-center">
            <Image
              src="/meguru_logo.png"
              alt="めぐる工芸舎のロゴ"
              width={120}
              height={40}
              priority
              className="h-[28px] w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-brand-800 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-brand-200 bg-transparent px-3 py-2 text-xs font-semibold text-brand-700 transition hover:border-brand-400 hover:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 sm:px-4 sm:text-sm"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full border border-brand-500/40 bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 sm:px-4 sm:text-sm"
            >
              新規登録
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-label="メニューを開く"
              aria-controls="site-header-mobile-menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-700 transition hover:border-brand-400 hover:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 md:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div
        className={`fixed inset-0 z-40 transition duration-300 ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          id="site-header-mobile-menu"
          className={`absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col gap-6 bg-white px-5 py-6 shadow-xl transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-900">メニュー</span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="メニューを閉じる"
              ref={closeButtonRef}
              tabIndex={isMenuOpen ? 0 : -1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-700 transition hover:border-brand-400 hover:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6l-12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-4 text-sm font-medium text-brand-800">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                tabIndex={isMenuOpen ? 0 : -1}
                className="rounded-md px-2 py-1 transition hover:bg-brand-50 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 text-sm">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-transparent px-4 py-2 font-semibold text-brand-700 transition hover:border-brand-400 hover:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              className="inline-flex items-center justify-center rounded-full border border-brand-500/40 bg-brand-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
            >
              新規登録
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
