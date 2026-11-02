"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  RotateCw,
  Wallet,
} from "lucide-react";

import type { Job } from "@/lib/jobs";
import { formatDate } from "@/lib/date";
import ApplyForm from "@/components/apply-form";
import { Button } from "@/components/ui/button";


type JobResponse = {
  job: Job;
};

type JobRequestState = {
  key: string;
  job: Job | null;
  loading: boolean;
  error: string;
  notFound: boolean;
};

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

// The page component
export default function JobDetailPage({
  params,
}: JobDetailPageProps) {
  return (
    <Suspense fallback={<JobDetailLoading />}>
      <JobDetailContent params={params} />
    </Suspense>
  );
}

// Loading UI displayed while the route parameters are being resolved
function JobDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="animate-pulse space-y-8">
        <div className="h-5 w-32 rounded bg-muted" />

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <div className="mb-5 h-3 w-32 rounded bg-muted" />
          <div className="mb-4 h-4 w-48 rounded bg-muted" />
          <div className="mb-8 h-10 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>

        <div className="space-y-5">
          <div className="h-7 w-48 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
      </div>
    </main>
  );
}

// Main job details component
function JobDetailContent({
  params,
}: JobDetailPageProps) {
  const { id } = use(params);

  const [retry, setRetry] = useState(0);

  const requestKey = `${id}:${retry}`;

  const [request, setRequest] = useState<JobRequestState>({
    key: "",
    job: null,
    loading: true,
    error: "",
    notFound: false,
  });

  // Derive the UI state from the current request key.
  const isCurrentRequest = request.key === requestKey;

  const job = isCurrentRequest ? request.job : null;
  const loading = !isCurrentRequest || request.loading;
  const error = isCurrentRequest ? request.error : "";
  const notFound = isCurrentRequest && request.notFound;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(
          `/api/jobs/${encodeURIComponent(id)}`,
          {
            signal: controller.signal,
          }
        );

        if (response.status === 404) {
          setRequest({
            key: requestKey,
            job: null,
            loading: false,
            error: "",
            notFound: true,
          });

          return;
        }

        const data: JobResponse & { message?: string } =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load this job."
          );
        }

        setRequest({
          key: requestKey,
          job: data.job,
          loading: false,
          error: "",
          notFound: false,
        });
      } catch (e) {
        if (!controller.signal.aborted) {
          setRequest({
            key: requestKey,
            job: null,
            loading: false,
            error:
              e instanceof Error
                ? e.message
                : "Something went wrong.",
            notFound: false,
          });
        }
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, retry, requestKey]);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 md:py-14 lg:px-8">

      {/* Back Navigation */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={18} />
        Back to all jobs
      </Link>

      {/* Loading State */}
      {loading ? (
        <div
          className="space-y-8"
          aria-busy="true"
          aria-label="Loading job details"
        >
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
            <div className="mb-5 h-3 w-32 animate-pulse rounded bg-muted" />
            <div className="mb-4 h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="mb-8 h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>

          <div className="space-y-5">
            <div className="h-7 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
        </div>

      ) : notFound ? (

        /* 404 State */
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <span className="font-heading text-7xl font-extrabold tracking-tight text-primary">
            404
          </span>

          <h1 className="mt-4 font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
            That role has moved on.
          </h1>

          <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
            We couldn&apos;t find this job. Explore the available
            opportunities instead.
          </p>

          <Button className="mt-7 gap-2">
            <Link href="/">
              <ArrowLeft size={18} />
              Browse all jobs
            </Link>
          </Button>
        </div>

      ) : error ? (

        /* Error State */
        <div
          className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-16 text-center"
          role="alert"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <RotateCw size={24} />
          </div>

          <h1 className="font-heading text-2xl font-extrabold text-foreground">
            Something went wrong.
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            {error}
          </p>

          <Button
            className="mt-6 gap-2"
            onClick={() => setRetry((v) => v + 1)}
          >
            Try again
            <RotateCw size={18} />
          </Button>
        </div>

      ) : job ? (

        <>
          {/* Job Header */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div className="min-w-0 flex-1">
                <span className="mb-4 block text-xs font-bold tracking-[0.15em] text-primary">
                  THE OPPORTUNITY
                </span>

                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span>{job.company}</span>
                  <span aria-hidden="true">·</span>
                  <span>{job.type}</span>
                </div>

                <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {job.title}
                </h1>

                {/* Job Metadata */}
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={17} />
                    {job.location}
                  </span>

                  {job.remote && (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      Remote-friendly
                    </span>
                  )}

                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={17} />
                    Posted {formatDate(job.postedAt)}
                  </span>
                </div>
              </div>

              {/* Application Action */}
              <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
                <ApplyForm jobId={job.id} jobTitle={job.title} />

                {job.salary && (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Wallet size={17} className="text-primary" />
                    {job.salary}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Job Description and Sidebar */}
          <div className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-16 lg:py-16">

            {/* Main Job Content */}
            <div className="min-w-0 space-y-12">

              {/* About the Role */}
              <section>
                <span className="mb-3 block text-xs font-bold tracking-[0.15em] text-primary">
                  01 / ABOUT THE ROLE
                </span>

                <h2 className="mb-5 font-heading text-2xl font-extrabold text-foreground">
                  What you&apos;ll be doing
                </h2>

                <p className="text-base leading-8 text-muted-foreground">
                  {job.description}
                </p>
              </section>

              {/* Responsibilities */}
              <section>
                <span className="mb-3 block text-xs font-bold tracking-[0.15em] text-primary">
                  02 / RESPONSIBILITIES
                </span>

                <h2 className="mb-5 font-heading text-2xl font-extrabold text-foreground">
                  Your impact
                </h2>

                <ul className="space-y-4">
                  {job.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base"
                    >
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check size={15} strokeWidth={2.5} />
                      </span>

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Requirements */}
              <section>
                <span className="mb-3 block text-xs font-bold tracking-[0.15em] text-primary">
                  03 / REQUIREMENTS
                </span>

                <h2 className="mb-5 font-heading text-2xl font-extrabold text-foreground">
                  What you bring
                </h2>

                <ul className="space-y-4">
                  {job.requirements.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base"
                    >
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check size={15} strokeWidth={2.5} />
                      </span>

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="h-fit rounded-2xl border border-border bg-secondary p-6 sm:p-8 lg:sticky lg:top-28">
              <span className="mb-4 block text-xs font-bold tracking-[0.15em] text-primary">
                WHY THIS ROLE?
              </span>

              <h3 className="font-heading text-2xl font-extrabold leading-tight text-foreground">
                Your next chapter could start here.
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Great work comes from finding the right fit. Think this is
                you? We&apos;d love to hear from you.
              </p>

              <div className="mt-7">
                <ApplyForm jobId={job.id} jobTitle={job.title} />
              </div>
            </aside>
          </div>
        </>

      ) : null}
    </main>
  );
}