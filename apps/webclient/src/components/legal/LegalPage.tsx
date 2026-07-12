"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { FadeIn } from "@/components/motion";

export type LegalSection = {
  heading: string;
  body: ReactNode;
};

export function LegalPage({
  title,
  updatedAt,
  intro,
  sections,
  breadcrumbLabel,
}: {
  title: string;
  updatedAt: string;
  intro: ReactNode;
  sections: LegalSection[];
  breadcrumbLabel: string;
}) {
  return (
    <>
      <main className="bg-background">
        <div className="container-vf py-10 sm:py-14 lg:py-16">
          <FadeIn>
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="transition-colors hover:text-brand">
                    Trang chủ
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="font-medium text-brand-dark">
                  {breadcrumbLabel}
                </li>
              </ol>
            </nav>

            <header className="mt-6 max-w-3xl">
              <h1 className="text-2xl font-extrabold tracking-tight text-brand-dark sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-xs text-muted-foreground">Cập nhật lần cuối: {updatedAt}</p>
              <div className="mt-5 text-sm leading-relaxed text-foreground/80 sm:text-base">
                {intro}
              </div>
            </header>
          </FadeIn>

          <div className="mt-10 max-w-3xl space-y-8">
            {sections.map((section, index) => (
              <FadeIn key={section.heading} delay={index * 0.05}>
                <section>
                  <h2 className="text-lg font-bold tracking-tight text-brand-dark sm:text-xl">
                    {index + 1}. {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
                    {section.body}
                  </div>
                </section>
              </FadeIn>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
