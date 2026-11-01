import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Wallet } from "lucide-react";
import type { Job } from "@/lib/jobs";
import { formatDate } from "@/lib/date";



export default function JobCard({ job }: { job: Job }) {
    return (
        <article className="flex min-w-0 min-h-67 flex-col rounded-xl 
            border border-border bg-card px-6 py-5 transition-all duration-200 
            hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
        >
            <div className="mb-5 flex items-center justify-between gap-2">
                <span className="grid size-10.5 place-items-center rounded-lg 
                    bg-secondary text-xl font-extrabold text-secondary-foreground"
                >
                    {job.company.slice(0, 1)}
                </span>
                <span className="whitespace-nowrap rounded-full border border-border 
                    bg-muted px-3 py-2 text-[11px] font-extrabold text-muted-foreground"
                >
                    {job.type}
                </span>
            </div>

            <p className="mb-1 text-xs font-bold text-muted-foreground">
                {job.company}
            </p>
            <h3 className="mb-4 font-heading text-lg font-bold leading-relaxed tracking-tight">
                <Link 
                    href={`/jobs/${encodeURIComponent(job.id)}`}
                    className="hover:underline"
                >
                    {job.title}
                </Link>
            </h3>

            <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={16} />
                    {job.location}
                </span>
                {job.remote && (
                    <span className="rounded-full bg-secondary px-2 py-1 text-[10px] 
                        font-bold text-secondary-foreground"
                    >
                        Remote-friendly
                    </span>
                )}
            </div>

            <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-4">
                <div className="flex min-w-0 flex-col gap-2">
                    {job.salary && (
                        <span className="flex items-center gap-2 text-xs font-extrabold text-foreground">
                            <Wallet size={16} />
                            {job.salary}
                        </span>
                    )}
                    <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <CalendarDays size={15} />
                        Posted {formatDate(job.postedAt)}
                    </span>
                </div>
                <Link
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground 
                                transition-colors hover:bg-primary hover:text-primary-foreground"
                    href={`/jobs/${encodeURIComponent(job.id)}`}
                    aria-label={`View ${job.title}`}
                >
                    <ArrowUpRight size={21} />
                </Link>
            </div>
        </article>
    );
}
