"use client";

import { useFeatureFlag } from "@/store/feature-flag-context";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Resolves the currently active program based on URL params or default.
 *
 * Priority:
 * 1. URL `special_section_id` param → match from programOptions
 * 2. First program in programOptions (default)
 *
 * Returns:
 * - `activeProgram`: the full ProgramOptions object (or null)
 * - `programPayload`: a clean `{ corp_program_id, corp_program_title }` ready for API
 * - `programOptions`: the full list for dropdowns
 */
export function useActiveProgram() {
  const { programOptions } = useFeatureFlag();
  const searchParams = useSearchParams();
  const specialSectionId = searchParams.get("special_section_id") || "";

  const activeProgram = useMemo(() => {
    if (specialSectionId) {
      const found = programOptions.find((opt) => opt.value === specialSectionId);
      if (found) return found;
    }
    return programOptions[0] || null;
  }, [programOptions, specialSectionId]);

  const programPayload = useMemo(
    () => ({
      corp_program_id: activeProgram?.id || "",
      corp_program_title: activeProgram?.title || activeProgram?.label || "",
    }),
    [activeProgram],
  );

  return { activeProgram, programPayload, programOptions };
}
