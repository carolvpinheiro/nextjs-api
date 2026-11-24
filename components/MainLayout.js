"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// menu links
const navigation = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/login", label: "Sign in" },
];

export default function MainLayout({ children }) {
  // use current path to highlight the open page in the menu
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-[#FAF8F5] text-[#30243A] md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      {/* show navigation at the top on mobile and sidebar for larger screens */}
      <aside className="bg-[#174C48] px-4 py-4 md:sticky md:top-0 md:h-dvh md:py-6">
        <div className="flex flex-col gap-4 md:h-full">
          <div className="border-b border-white/15 px-3 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md text-xl font-bold text-[#DA9085] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src="/icon.svg"
                alt=""
                width={20}
                height={20}
                unoptimized
              />
              JamJar
            </Link>
          </div>

          <nav aria-label="Main navigation" className="flex flex-col md:flex-1">
            <ul className="flex flex-wrap gap-2 md:flex-1 md:flex-col">
              {navigation.map(({ href, label }) => {
                const isCurrentPage = pathname === href;

                // keep Projects highlighted on its detail pages
                const isActive =
                  isCurrentPage ||
                  (href === "/projects" && pathname.startsWith("/projects/"));

                return (
                  <li
                    key={href}
                    className={
                      href === "/login"
                        ? "ml-auto md:ml-0 md:mt-auto"
                        : undefined
                    }
                  >
                    <Link
                      href={href}
                      aria-current={isCurrentPage ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        isActive
                          ? "bg-[#DA9085]/80 font-semibold text-[#30243A]"
                          : "font-medium text-[#DA9085] hover:bg-white/10"
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
          <div className="mx-auto max-w-8xl px-5 py-4 text-sm text-[#65586B] sm:px-8">
            JamJar · Project Management Workspace
          </div>
        </footer>
      </div>
    </div>
  );
}
