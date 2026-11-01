import dataset from "@/data/jobs.json";


export const JOB_TYPES = [
    "Full-time", 
    "Part-time", 
    "Contract", 
    "Internship"
] as const; // Define the job types as a constant array

export type JobType = (typeof JOB_TYPES)[number];   // Create a type that represents the union of the job types

export type Job = {
    id: string; 
    title: string; 
    company: string; 
    location: string; 
    type: JobType;
    remote: boolean; 
    salary: string | null; 
    postedAt: string; 
    description: string;
    responsibilities: string[]; 
    requirements: string[];
};

const jobs = dataset.jobs as Job[];

// Function to get jobs based on query and type
export const getJobs = (query = '', type = ''): Job[] => {
    const q = query.toLocaleLowerCase().trim();
    const allJobs = jobs.filter(job => 
        (!type || job.type === type) &&
        (!q || job.title.toLocaleLowerCase().includes(q) || job.company.toLocaleLowerCase().includes(q))
    ).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    
    return allJobs;
};

// Function to get a single job by its ID
export const getJob = (id: string): Job | undefined => {
    return jobs.find(job => job.id === id);
};

export const delay = (ms = 450) => new Promise(resolve => setTimeout(resolve, ms));

export type ApiError = { 
    code: string; 
    message: string; 
    fields: Record<string, string> 
};

export function errorResponse(
    code: string, 
    message: string, 
    status: number, 
    fields: Record<string, string> = {}
) {
  return Response.json({ code, message, fields } satisfies ApiError, { status });
}
