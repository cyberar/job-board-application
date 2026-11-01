import { errorResponse, delay, getJobs, JOB_TYPES } from "@/lib/jobs";


export async function GET(request: Request) {
    await delay();
    
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") ?? "";
    const type = searchParams.get("type") ?? "";

    // Validate the employment type
    if (type && !JOB_TYPES.includes(type as (typeof JOB_TYPES)[number])) {
        return errorResponse("VALIDATION_ERROR", "Invalid job type.", 400, {
        type: "Invalid job type.",
        });
    }

    // Retrieve filtered jobs
    const filteredJobs = getJobs(query, type);

    return Response.json({
        jobs: filteredJobs,
        total: filteredJobs.length,
    });
}
