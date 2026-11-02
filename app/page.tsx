
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import JobList from "@/components/job-list";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="overflow-hidden bg-secondary">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8">

          {/* Hero Content */}
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              YOUR NEXT CHAPTER STARTS HERE
            </div>

            <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Good work.
              <br />
              <span className="text-primary">Great future.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Find work that feels like progress. Explore thoughtfully curated
              opportunities from teams doing things differently.
            </p>

            <div className="mt-8">
              <Button size="lg" className="gap-2">
                <a href="#openings">
                  Explore open roles
                  <ArrowUpRight size={20} />
                </a>
              </Button>
            </div>

            {/* Hero Note */}
            <div className="mt-10 flex items-center gap-3 text-sm font-medium text-muted-foreground">
              {/* <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                <Sparkles size={17} />
              </span> */}

              <span>
                New possibilities. Real impact. Beter Mondays.
              </span>
            </div>
          </div>

          {/* Decorative Hero Artwork */}
          <div
            aria-hidden="true"
            className="relative mx-auto h-95 w-full max-w-130 overflow-hidden rounded-t-[220px] bg-primary sm:h-110 lg:h-125"
          >
            {/* Decorative Circles */}
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full 
              border border-primary-foreground/20" 
            />

            <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full 
              border border-primary-foreground/20" 
            />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,
              transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] 
              bg-size[32px_32px]" 
            />

            {/* Artwork Text */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 font-heading text-6xl font-extrabold leading-[0.95] tracking-tight text-primary-foreground sm:left-12 sm:text-7xl lg:text-8xl">
              YOUR
              <br />
              NEXT
              <br />
              <i className="font-normal">MOVE.</i>
            </div>

            {/* Sticker */}
            <span className="absolute right-6 top-10 rotate-6 rounded-full bg-accent px-5 py-4 text-center text-xs font-extrabold leading-5 tracking-wider text-accent-foreground shadow-lg sm:right-10 sm:top-14">
              MAKE IT
              <br />
              COUNT
            </span>

            {/* Arrow */}
            <ArrowDownRight
              className="absolute bottom-8 right-8 text-primary-foreground sm:bottom-12 sm:right-12"
              size={68}
              strokeWidth={1.2}
            />
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <JobList />
    </>
  );
}
