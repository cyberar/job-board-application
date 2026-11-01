import { z } from "zod";
import { errorResponse, delay, getJob } from "@/lib/jobs";


const applicationSchema = z.object({
    jobId: z.string().min(1, "Please select a job."),

    name: z.string().trim().min(2, "Enter your full name (at least 2 characters)."),

    email: z.string().trim().email("Enter a valid email address."),

    coverNote: z.string().trim().min(20, "Write at least 20 characters about your interest."),

    resumeUrl: z.string().url("Enter a valid resume or portfolio URL.")
        .refine(
            (value) => ['http:', 'https:'].includes(new URL(value).protocol),
            "Use an HTTP or HTTPS link."
        ),
});

export async function POST(request: Request) {
    await delay(700);
    let raw: unknown;

    try {
        raw = await request.json();
    } catch {
        return errorResponse(
            "INVALID_JSON",
            "Please provide valid JSON.",
            400
        );
    }

    const result = applicationSchema.safeParse(raw);

    if (!result.success) {
        const fields: Record<string, string> = {};

        for (const issue of result.error.issues) {
            const field = issue.path[0];

            if (typeof field === 'string' && !fields[field]) {
                fields[field] = issue.message;
            }
        }

        return errorResponse(
            "VALIDATION_ERROR",
            "Please correct the highlighted fields.",
            422,
            fields
        );
    }

    const data = result.data;

    if (!getJob(data.jobId)) {
        return errorResponse(
            "VALIDATION_ERROR",
            "Please correct the highlighted fields.",
            422,
            { jobId: "Please select an existing job." }
        );
    }

    console.info('Application submitted:', {
        ...data,
        email: "[redacted]",
        name: "[redacted]",
    });

    return Response.json(
        { message: "Your application has been submitted successfully." },
        { status: 201 }
    );
}
