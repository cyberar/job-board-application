
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import ThemeProvider from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";

import "./globals.css";

import { DM_Sans, Manrope } from "next/font/google";


const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Careerboard | Find your next opportunity",
  description: "Discover jobs that move your career forward.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning  data-scroll-behavior="smooth">
      <body className={`${dmSans.variable} ${manrope.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
              <div className="mx-auto flex h-20 w-full max-w-7xl items-center 
                justify-between px-4 sm:px-6 lg:px-8"
              >

                {/* Brand */}
                <Link
                  href="/"
                  className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <BriefcaseBusiness size={20} strokeWidth={2.4} />
                  </span>

                  careerboard
                  <span className="text-primary">.</span>
                </Link>

                {/* Navigation */}
                <nav
                  aria-label="Main navigation"
                  className="flex items-center gap-3 sm:gap-5"
                >
                  <Link
                    href="/"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Find jobs
                  </Link>

                  <ThemeToggle />

                  <a
                    href="mailto:cybercodergirl@gmail.com?subject=Job%20board%20enquiry"
                    className={buttonVariants({ size: "sm" })}
                  >
                    Get in touch
                    <ArrowUpRight size={16} />
                  </a>
                </nav>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-background">
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <span>
                  © 2026 Careerboard. Built for what&apos;s next.
                </span>

                <span>
                  Opportunities worth exploring{" "}
                  <span className="text-primary">✳</span>
                </span>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
