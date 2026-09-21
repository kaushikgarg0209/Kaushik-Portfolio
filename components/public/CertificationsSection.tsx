"use client";

import { Award, ExternalLink } from "lucide-react";
import Image from "next/image";

import { SectionHeader } from "@/components/public/SectionHeader";
import { SectionWrapper } from "@/components/public/SectionWrapper";
import { formatDate } from "@/lib/utils";
import type { Certification } from "@/lib/db/schema";

export function CertificationsSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  return (
    <SectionWrapper id="certifications">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          kicker="Certifications"
          title="Certifications"
          subtitle="Professional credentials"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="glass rounded-xl p-5">
              <div className="mb-3 flex items-start gap-3">
                {cert.badgeImageUrl ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <Image src={cert.badgeImageUrl} alt={cert.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
                    <Award className="h-5 w-5 text-cyan-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-white">{cert.name}</h3>
                  <p className="text-sm text-slate-400">{cert.issuer}</p>
                </div>
              </div>
              <p className="font-mono text-xs text-slate-500">
                Issued {formatDate(cert.issueDate)}
              </p>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                >
                  Verify <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
