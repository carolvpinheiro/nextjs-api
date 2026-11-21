"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// menu links
const navigation = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Sign in" },
];

export default function MainLayout({ children }) {
  // use current path to highlight the open page in the menu
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-[#FAF8F5] text-[#30243A] md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      {/* show navigation at the top on mobile and sidebar for larger screens */}
      <aside className="bg-[#174C48] px-5 py-4 text-[#F4A394] md:sticky md:top-0 md:h-dvh md:py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 md:block">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold"
          >
            <span aria-hidden="true">🍓</span>
            JamJar
          </Link>

          <nav aria-label="Main navigation" className="md:mt-8">
            <ul className="flex flex-wrap gap-2 md:flex-col">
              {navigation.map(({ href, label }) => {
                const isActive = pathname === href;

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-[#F4A394] ${
                        isActive
                          ? "bg-[#F4A394]/10 font-semibold"
                          : "font-medium hover:bg-[#F4A394]/10"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col md:min-h-dvh">
        {/* reder the current page */}
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8">
          {children}
        </main>

        <footer className="border-t border-[#E9E1E7]">
          <div className="mx-auto max-w-6xl px-5 py-4 text-sm text-[#65586B] sm:px-8">
            JamJar · Project Management Workspace
          </div>
        </footer>
      </div>
    </div>
  );
}
