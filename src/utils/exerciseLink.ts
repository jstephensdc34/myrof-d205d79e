/** Exercise instructions links flow into templates, preview, shared HTML and PDF. */
export const getExerciseLink = (raw?: string): string => {
  const value = (raw ?? "").trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};
