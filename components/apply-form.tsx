
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ApiError } from "@/lib/jobs";

type Fields = {
  name: string;
  email: string;
  coverNote: string;
  resumeUrl: string;
};

const emptyFields: Fields = {
  name: "",
  email: "",
  coverNote: "",
  resumeUrl: "",
};

type FieldErrors = Partial<Record<keyof Fields, string>>;

export default function ApplyForm({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");
  const [success, setSuccess] = useState(false);

  // Close modal when Escape is pressed
  useEffect(() => {
    if (!open) return;

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", close);

    return () => {
      window.removeEventListener("keydown", close);
    };
  }, [open, submitting]);

  // Validate form fields
  const validate = () => {
    const next: FieldErrors = {};

    if (values.name.trim().length < 2) {
      next.name = "Enter at least 2 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(values.email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (values.coverNote.trim().length < 20) {
      next.coverNote = "Please write at least 20 characters.";
    }

    try {
      const url = new URL(values.resumeUrl.trim());

      if (!["https:", "http:"].includes(url.protocol)) {
        next.resumeUrl = "Use an HTTP or HTTPS URL.";
      }
    } catch {
      next.resumeUrl = "Enter a valid portfolio or resume URL.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  // Submit application
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFailure("");

    if (!validate()) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          jobId,
        }),
      });

      const data: { message?: string } & Partial<ApiError> =
        await response.json();

      if (!response.ok) {
        setErrors(data.fields ?? {});
        setFailure(data.message ?? "Unable to submit. Try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setFailure("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Close modal and reset form
  const dismiss = () => {
    if (submitting) return;

    setOpen(false);
    setFailure("");
    setErrors({});
    setSuccess(false);
    setValues(emptyFields);
  };

  // Update a field and clear its validation error
  const update = (field: keyof Fields, value: string) => {
    setValues((old) => ({
      ...old,
      [field]: value,
    }));

    setErrors((old) => ({
      ...old,
      [field]: "",
    }));
  };

  // Shared styling for form inputs
  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 aria-[invalid=true]:border-destructive";

  // Shared styling for form labels
  const labelClass = "mb-2 block text-sm font-semibold text-foreground";

  return (
    <>
      {/* Open Application Modal */}
      <Button
        type="button"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        Apply for this job
        <ArrowRight size={19} />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-100 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) dismiss();
          }}
        >
          {/* Modal */}
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-modal-title"
            aria-describedby="apply-modal-description"
          >
            {/* Close Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              aria-label="Close application form"
              disabled={submitting}
              onClick={dismiss}
            >
              <X size={22} />
            </Button>

            {success ? (
              /* Success State */
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 size={38} />
                </div>

                <h2 className="font-heading text-2xl font-extrabold text-foreground">
                  Application received!
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                  Your application for{" "}
                  <strong className="text-foreground">{jobTitle}</strong>{" "}
                  has been submitted. Thanks for taking the next step.
                </p>

                <Button
                  type="button"
                  className="mt-8 gap-2"
                  onClick={dismiss}
                >
                  Back to job details
                  <ArrowRight size={17} />
                </Button>
              </div>
            ) : (
              <>
                {/* Modal Heading */}
                <div className="mb-7 pr-8">
                  <span className="mb-3 block text-xs font-bold tracking-[0.15em] text-primary">
                    YOUR NEXT MOVE
                  </span>

                  <h2
                    id="apply-modal-title"
                    className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
                  >
                    Let&apos;s get you noticed.
                  </h2>

                  <p
                    id="apply-modal-description"
                    className="mt-3 text-sm leading-6 text-muted-foreground"
                  >
                    Applying for{" "}
                    <strong className="text-foreground">{jobTitle}</strong>
                  </p>
                </div>

                {/* Application Form */}
                <form onSubmit={submit} noValidate className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="app-name" className={labelClass}>
                      Full name <span className="text-destructive">*</span>
                    </label>

                    <input
                      id="app-name"
                      type="text"
                      autoFocus
                      value={values.name}
                      onChange={(e) => update("name", e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? "name-error" : undefined
                      }
                      placeholder="Your full name"
                      className={inputClass}
                    />

                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-2 text-xs font-medium text-destructive"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="app-email" className={labelClass}>
                      Email address <span className="text-destructive">*</span>
                    </label>

                    <input
                      id="app-email"
                      type="email"
                      value={values.email}
                      onChange={(e) => update("email", e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      placeholder="you@example.com"
                      className={inputClass}
                    />

                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-2 text-xs font-medium text-destructive"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Resume URL */}
                  <div>
                    <label htmlFor="app-url" className={labelClass}>
                      Resume or portfolio URL{" "}
                      <span className="text-destructive">*</span>
                    </label>

                    <input
                      id="app-url"
                      type="url"
                      value={values.resumeUrl}
                      onChange={(e) => update("resumeUrl", e.target.value)}
                      aria-invalid={Boolean(errors.resumeUrl)}
                      aria-describedby={
                        errors.resumeUrl ? "url-error" : undefined
                      }
                      placeholder="https://your-portfolio.com"
                      className={inputClass}
                    />

                    {errors.resumeUrl && (
                      <p
                        id="url-error"
                        className="mt-2 text-xs font-medium text-destructive"
                      >
                        {errors.resumeUrl}
                      </p>
                    )}
                  </div>

                  {/* Cover Note */}
                  <div>
                    <label htmlFor="app-note" className={labelClass}>
                      Cover note <span className="text-destructive">*</span>
                    </label>

                    <textarea
                      id="app-note"
                      rows={4}
                      value={values.coverNote}
                      onChange={(e) => update("coverNote", e.target.value)}
                      aria-invalid={Boolean(errors.coverNote)}
                      aria-describedby={
                        errors.coverNote ? "note-error" : undefined
                      }
                      placeholder="Tell us why you're a great fit..."
                      className={`${inputClass} min-h-28 resize-y`}
                    />

                    {errors.coverNote && (
                      <p
                        id="note-error"
                        className="mt-2 text-xs font-medium text-destructive"
                      >
                        {errors.coverNote}
                      </p>
                    )}
                  </div>

                  {/* Submission Error */}
                  {failure && (
                    <p
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                      role="alert"
                    >
                      {failure}
                    </p>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Sending application..."
                      : "Submit application"}

                    {!submitting && <ArrowRight size={18} />}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
