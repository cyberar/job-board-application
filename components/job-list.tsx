"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  RotateCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import JobCard from "@/components/job-card";
import type { Job } from "@/lib/jobs";


const TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"];

export default function JobList() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const clearFilters = useCallback(() => {
    setSearch("");
    setType("All");
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(
      async () => {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("q", search.trim());
        }

        if (type !== "All") {
          params.set("type", type);
        }

        try {
          const response = await fetch(`/api/jobs?${params}`, {
            signal: controller.signal,
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || "Unable to load jobs.");
          }

          setJobs(result.jobs);
        } catch (e) {
          if (!controller.signal.aborted) {
            setError(
              e instanceof Error
                ? e.message
                : "Something went wrong."
            );
          }
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      },
      search ? 250 : 0
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, type, retry]);

  return (
    <section
      id="openings"
      className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 md:py-20 lg:px-8"
    >
      {/* Section Heading */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <span className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-muted-foreground">
            <span className="h-px w-7 bg-primary" />
            EXPLORE OPPORTUNITIES
          </span>

          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Find your next{" "}
            <em className="text-primary">big move.</em>
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Discover roles from forward-thinking teams building meaningful
            things.
          </p>
        </div>

        <span
          className="text-sm font-medium text-muted-foreground"
          aria-live="polite"
        >
          {loading
            ? "Finding roles..."
            : `${jobs.length} open ${
                jobs.length === 1 ? "position" : "positions"
              }`}
        </span>
      </div>

      {/* Search and Filters */}
      <div className="mb-7 flex flex-col gap-3 sm:flex-row">
        {/* Search Input */}
        <div className="flex min-h-12 flex-1 items-center gap-3 rounded-lg border border-input bg-background px-4 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
          <Search
            size={19}
            className="shrink-0 text-muted-foreground"
          />

          <input
            aria-label="Search jobs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search job title or company..."
            className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />

          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="h-8 w-8 shrink-0"
            >
              <X size={17} />
            </Button>
          )}
        </div>

        {/* Job Type Dropdown */}
        <div className="flex min-h-12 items-center gap-3 rounded-lg border border-input bg-background px-4 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 sm:w-52">
          <SlidersHorizontal
            size={17}
            className="shrink-0 text-muted-foreground"
          />

          <select
            aria-label="Filter by job type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent py-3 text-sm text-foreground outline-none"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All job types" : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Loading jobs"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              className="flex min-h-67 flex-col gap-5 rounded-xl border border-border bg-card p-6"
              key={i}
            >
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              </div>

              <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />

              <div className="mt-auto space-y-3">
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-px w-full bg-border" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div
          className="my-10 flex flex-col items-center rounded-xl border border-border bg-card px-6 py-12 text-center"
          role="alert"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <RotateCw size={24} />
          </div>

          <h3 className="text-xl font-bold text-foreground">
            We couldn't load the jobs
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <Button
            className="mt-6 gap-2"
            onClick={() => setRetry((n) => n + 1)}
          >
            Try again
            <RotateCw size={17} />
          </Button>
        </div>
      ) : !jobs.length ? (
        /* Empty State */
        <div className="my-10 flex flex-col items-center rounded-xl border border-border bg-card px-6 py-12 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Search size={24} />
          </div>

          <h3 className="text-xl font-bold text-foreground">
            No matches this time
          </h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Try another keyword or job type to see more opportunities.
          </p>

          <Button
            variant="outline"
            className="mt-6 gap-2"
            onClick={clearFilters}
          >
            Clear filters
            <X size={17} />
          </Button>
        </div>
      ) : (
        /* Job Results */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
        </div>
      )}

      {/* Section Footer */}
      <div className="mt-12 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.15em] text-muted-foreground">
        <span>THE RIGHT OPPORTUNITY CHANGES EVERYTHING</span>
        <ArrowRight size={18} className="text-primary" />
      </div>
    </section>
  );
}
