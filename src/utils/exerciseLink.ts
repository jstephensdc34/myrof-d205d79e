/**
 * Report-only "Exercise Instructions Link" (Therapeutic Exercises tab).
 * Not persisted with care plans or library items — flows into the
 * preview, shared HTML and PDF via OverviewReport only.
 */
export const getExerciseLink = (raw?: string): string => {
  const value = (raw ?? "").trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};
