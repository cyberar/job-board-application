# Careerboard — Next.js job board

<a name="readme-top"></a>
<div align="center">
  <a href="https://github.com/cyberar/job-board-application">
    
  </a>
</div>

---

<div align="center">
  <h1><img src="./public/landing-page.PNG" alt="Logo" width="90%" height="40%">
  </h1>
</div>

<div>
  <p align="center">
    <a href="https://github.com/cyberar/job-board-application/wiki"><strong>Explore the Docs »</strong></a>
    <br />
    <a href="https://github.com/cyberar/job-board-application/blob/main/public/landing-page.PNG">View Demo</a>
    ·
    <a href="https://github.com/cyberar/job-board-application/issues">Report Bug</a>
    ·
    <a href="https://github.com/cyberar/job-board-application/issues">Request Feature</a>
  </p>
</div>

---

<!--- Table of Contents --->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About CareerBoard</a>
      <ul>
        <li><a href="#stack">Stack</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#Prerequisite">Prerequisite</a></li>
    <li><a href="#Installation">Installation</a></li>    
    <li><a href="#routes-and-API">Routes and API</a></li>
    <li><a href="#how-it-works">How it works</a></li>
    <li><a href="#Folder-Structure">Folder Structure</a></li>
    <li><a href="#Future-Implementation">Future Implementation</a></li>
    <li><a href="Key-Learning-Points">Key Learning Points</a></li>
  </ol>
  <p align="right"><a href="#readme-top">back to top</a></p>
</details>

---

## About
A responsive job board built for candidates to apply for jobs and  monitor their progress (future feature).

---

## Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI Library: React 19
- Styling: Tailwind CSS 4
- Icons: Lucide icons

---

## Getting Started

### Prerequisite
- Node.js 20+ installed.
- npm, yarn, pnpm, or bun

### Installation
1. Clone the repository:

```bash
git clone https://github.com/cyberar/job-board-application.git
cd job-board-application
```

2. Install dependencies:

```bash
npm install
npm run dev
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Routes and API

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Searchable, filterable job listings |
| GET | `/jobs/:id` | Individual job and Apply modal |
| GET | `/api/jobs?q=engineer&type=Full-time` | Filter jobs by title/company keyword and/or type, newest first |
| GET | `/api/jobs/:id` | Fetch one job; 404 for missing IDs |
| POST | `/api/apply` | Validate and log application data; 201 on success |

Example POST request:

```bash
curl -i -X POST http://localhost:3000/api/apply \
  -H 'Content-Type: application/json' \
  -d '{"jobId":"1","name":"Jane Doe","email":"jane@example.com","coverNote":"I would be a great fit for the team.","resumeUrl":"https://example.com/cv"}'
```

On validation failure, responses have the common shape:

```json
{"code":"VALIDATION_ERROR","message":"Please correct the highlighted fields.","fields":{"email":"Enter a valid email address."}}
```

---

## How it Works
- **API-only UI data**: only `lib/jobs.ts` imports `data/jobs.json`. React components fetch data through `/api/jobs` and `/api/jobs/:id`. The seed data remains unchanged.
- **Search and filter combine**: `q` matches title or company case-insensitively; `type` narrows by job type. Results are sorted by `postedAt` descending.
- **Robust state handling**: Loading skeletons, error+retry, empty state+clear filters, proper 404 and client/server form validation.
- **Safe application behavior**: Missing/invalid fields are rejected on the server independently of frontend checks. The demo logs accepted applications server-side; it deliberately does **not** persist them or email applicants. Personally identifiable fields are redacted in console logs.
- **Visible loading**: Intentional 450ms/700ms endpoint delays, and debounced search with abortable fetches.
- **Reusable components**: `JobCard`, `JobList`, `ApplyForm`, API utilities and shared styles.
- **Responsiveness**: Three-column cards on desktop, two on tablet, one on mobile. Very long titles wrap and absent salary is omitted without a placeholder.

---

## Folder Structure

```
job-board-application/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   └── apply/          # Application form API route
│   │   └── jobs/           # Jobs route
│   ├── jobs/[id]/          # Job details page
│   ├── globals.css         # Style sheet
│   ├── layout.tsx
│   └── page.tsx          
├── components/             # React components
│   ├── ui/                 # Reusable UI components
│   ├── apply-form.tsx      # Application modal component
│   ├── job-card.tsx        # Job 
│   ├── job-list.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx  
├── lib/
│   ├── date.ts             # Reusable date format utility
│   ├── jobs.ts             # Server actions            
│   └── utils.ts            # Shadcn utils
├── public/
└── data/                   # Database actions
    └── jobs.json           # Database seeding
```

---

## Future Implementation
- Add a database (PostgreSQL), durable applications, and email notifications.
- Introduce proper authentication, abuse prevention / rate-limiting and spam protection.
- Add automated API and UI tests (Vitest / Playwright), accessibility audits, pagination and URL-backed search filters.
- Add real company logos, richer job categories and detailed telemetry.
- Dashboard for candidates to track their job application, options to drag and drop: wishlist, applied, 
interviewing and offer
- Add monitoring and observability
- 

## Key Learning Points 
