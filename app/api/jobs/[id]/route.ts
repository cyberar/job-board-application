import { errorResponse, delay, getJob } from "@/lib/jobs";


export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    await delay();
    
    const { id } = await params;

    const job = getJob(id);

    if (!job) {
        return errorResponse(
            "JOB_NOT_FOUND",
            "This job could not be found.",
            404
        );
    }

    return Response.json({ job });
}
