"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import type { SocialLink } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { CONTACT_FIELD_LIMITS, contactSchema } from "@/lib/validations";

type ContactFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function getFieldErrors(form: ContactFields) {
  const result = contactSchema.safeParse(form);
  if (result.success) return {} as Partial<Record<keyof ContactFields, string>>;

  const errors: Partial<Record<keyof ContactFields, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ContactFields | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

const fieldClass = (hasError: boolean) =>
  cn(
    "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-sm text-white focus:outline-none",
    hasError
      ? "border-red-500/60 focus:border-red-500/80"
      : "border-white/10 focus:border-cyan-500/50",
  );

function charCountClass(length: number, max: number) {
  if (length >= max) return "text-red-400";
  if (length >= max * 0.9) return "text-amber-400";
  return "text-slate-500";
}

export function ContactForm({
  socialLinks,
  email,
}: {
  socialLinks: SocialLink[];
  email: string;
}) {
  const [form, setForm] = useState<ContactFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFields, boolean>>>(
    {},
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [sending, setSending] = useState(false);

  const fieldErrors = useMemo(() => getFieldErrors(form), [form]);

  function showError(field: keyof ContactFields) {
    if (!touched[field] && !submitAttempted) return undefined;
    return fieldErrors[field];
  }

  function markTouched(field: keyof ContactFields) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function updateField(field: keyof ContactFields, value: string) {
    const max = CONTACT_FIELD_LIMITS[field];
    setForm((prev) => ({ ...prev, [field]: value.slice(0, max) }));
  }

  const isValid = contactSchema.safeParse(form).success;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (!isValid) return;

    setSending(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTouched({});
      setSubmitAttempted(false);
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to send message");
    }
    setSending(false);
  }

  const nameError = showError("name");
  const emailError = showError("email");
  const subjectError = showError("subject");
  const messageError = showError("message");
  const messageHint =
    !messageError &&
    form.message.length > 0 &&
    form.message.length < 10
      ? `${10 - form.message.length} more character${10 - form.message.length === 1 ? "" : "s"} needed`
      : null;

  return (
    <SectionWrapper id="contact">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          command="$ npm run contact"
          title="Get In Touch"
          subtitle="Have a project in mind? Let's talk."
        />

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="glass rounded-xl p-6 font-mono text-sm">
              <p className="text-slate-500">
                <span className="text-green-400">user@portfolio</span>
                <span className="text-slate-400">:</span>
                <span className="text-cyan-400">~</span>
                <span className="text-slate-400">$ </span>
                <span className="text-white">echo $EMAIL</span>
              </p>
              <p className="mt-1 text-cyan-300">{email}</p>
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass rounded-lg px-4 py-2 font-mono text-sm text-slate-400 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="glass space-y-4 rounded-xl p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="font-mono text-xs text-slate-500">--name</label>
                  <span
                    className={cn(
                      "font-mono text-xs",
                      charCountClass(form.name.length, CONTACT_FIELD_LIMITS.name),
                    )}
                  >
                    {form.name.length}/{CONTACT_FIELD_LIMITS.name}
                  </span>
                </div>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => markTouched("name")}
                  maxLength={CONTACT_FIELD_LIMITS.name}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "contact-name-error" : undefined}
                  className={fieldClass(Boolean(nameError))}
                />
                {nameError && (
                  <p id="contact-name-error" className="mt-1 text-xs text-red-400">
                    {nameError}
                  </p>
                )}
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="font-mono text-xs text-slate-500">--email</label>
                  <span
                    className={cn(
                      "font-mono text-xs",
                      charCountClass(form.email.length, CONTACT_FIELD_LIMITS.email),
                    )}
                  >
                    {form.email.length}/{CONTACT_FIELD_LIMITS.email}
                  </span>
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => markTouched("email")}
                  maxLength={CONTACT_FIELD_LIMITS.email}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "contact-email-error" : undefined}
                  className={fieldClass(Boolean(emailError))}
                />
                {emailError && (
                  <p id="contact-email-error" className="mt-1 text-xs text-red-400">
                    {emailError}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="font-mono text-xs text-slate-500">--subject</label>
                <span
                  className={cn(
                    "font-mono text-xs",
                    charCountClass(form.subject.length, CONTACT_FIELD_LIMITS.subject),
                  )}
                >
                  {form.subject.length}/{CONTACT_FIELD_LIMITS.subject}
                </span>
              </div>
              <input
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                onBlur={() => markTouched("subject")}
                maxLength={CONTACT_FIELD_LIMITS.subject}
                aria-invalid={Boolean(subjectError)}
                aria-describedby={subjectError ? "contact-subject-error" : undefined}
                className={fieldClass(Boolean(subjectError))}
              />
              {subjectError && (
                <p id="contact-subject-error" className="mt-1 text-xs text-red-400">
                  {subjectError}
                </p>
              )}
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="font-mono text-xs text-slate-500">--message</label>
                <span
                  className={cn(
                    "font-mono text-xs",
                    form.message.length >= 10 && form.message.length < CONTACT_FIELD_LIMITS.message
                      ? "text-green-400"
                      : charCountClass(form.message.length, CONTACT_FIELD_LIMITS.message),
                  )}
                >
                  {form.message.length}/{CONTACT_FIELD_LIMITS.message}
                </span>
              </div>
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                onBlur={() => markTouched("message")}
                maxLength={CONTACT_FIELD_LIMITS.message}
                rows={5}
                aria-invalid={Boolean(messageError)}
                aria-describedby={
                  messageError || messageHint ? "contact-message-error" : undefined
                }
                className={fieldClass(Boolean(messageError))}
              />
              {(messageError || messageHint) && (
                <p
                  id="contact-message-error"
                  className={cn(
                    "mt-1 text-xs",
                    messageError ? "text-red-400" : "text-slate-500",
                  )}
                >
                  {messageError ?? messageHint}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={sending || (submitAttempted && !isValid)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-cyan-400 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
}
