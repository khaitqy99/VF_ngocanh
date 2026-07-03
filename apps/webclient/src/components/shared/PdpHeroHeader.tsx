"use client";

import { Sparkles } from "lucide-react";
import { EditableText } from "@/components/admin-edit/EditableField";
import { useAdminEdit } from "@/components/admin-edit/AdminEditContext";
import { vfPdpHeroTitle } from "@/lib/typography";

type Props = {
  tagline?: string;
  name: string;
  slogan?: string;
  badges?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  adminEditable?: boolean;
};

export function PdpHeroHeader({
  tagline,
  name,
  slogan,
  badges = [],
  isNew,
  isBestSeller,
  adminEditable,
}: Props) {
  const edit = useAdminEdit();
  const editable = adminEditable && edit?.editMode;
  const showBadges = badges.length > 0 || isNew || isBestSeller;

  return (
    <header className="relative overflow-hidden bg-brand-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0,87,255,0.45), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255,213,0,0.08), transparent 50%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyUzEyIDI0LjYyNyAxMiAxOCAxNy4zNzMgNiAyNCA2czEyIDUuMzczIDEyIDEyem0wIDI0YzAgNi42MjctNS4zNzMgMTItMTIgMTJzLTEyLTUuMzczLTEyLTEyIDUuMzczLTEyIDEyLTEyIDEyIDUuMzczIDEyIDEyeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDMiLz48L2c+PC9zdmc+')] opacity-40" />

      <div className="container-vf relative py-7 sm:py-9 lg:py-11">
        {showBadges && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {badges.map((badge, i) => (
              <span
                key={`badge-${i}`}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm sm:text-[11px]"
              >
                <Sparkles className="size-3 shrink-0 text-accent-yellow" />
                <span className="truncate">
                  {editable ? (
                    <EditableText
                      value={badge}
                      onChange={(v) => {
                        const next = [...badges];
                        next[i] = v;
                        edit!.update({ badges: next.join(", ") });
                      }}
                      className="text-[10px] font-bold text-white sm:text-[11px]"
                      label={`Badge ${i + 1}`}
                    />
                  ) : (
                    badge
                  )}
                </span>
              </span>
            ))}
            {isNew && (
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white sm:text-[11px]">
                MỚI
              </span>
            )}
            {isBestSeller && (
              <span className="rounded-full bg-accent-yellow px-3 py-1 text-[10px] font-bold text-brand-dark sm:text-[11px]">
                BÁN CHẠY
              </span>
            )}
          </div>
        )}

        {(tagline || editable) && (
          <p className="text-[11px] font-bold tracking-[0.22em] text-blue-300/90 uppercase sm:text-xs">
            {editable ? (
              <EditableText
                value={tagline ?? ""}
                onChange={(v) => edit!.update({ tagline: v })}
                className="text-[11px] font-bold tracking-[0.22em] text-blue-300/90 uppercase sm:text-xs"
                label="Tagline"
              />
            ) : (
              tagline
            )}
          </p>
        )}

        <h1 className={`mt-2 max-w-4xl ${vfPdpHeroTitle}`}>
          {editable ? (
            <EditableText
              value={name}
              onChange={(v) => edit!.update({ name: v })}
              className={vfPdpHeroTitle}
              label="Tên xe"
            />
          ) : (
            name
          )}
        </h1>

        {(slogan || editable) && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-[15px] lg:mt-4">
            {editable ? (
              <EditableText
                value={slogan ?? ""}
                onChange={(v) => edit!.update({ slogan: v })}
                className="text-sm leading-relaxed text-white/70 sm:text-[15px]"
                multiline
                label="Slogan"
              />
            ) : (
              slogan
            )}
          </p>
        )}
      </div>
    </header>
  );
}
