import type { TreatmentScheduleParts } from "./treatmentSchedule";

export const emptyTreatmentSchedule = (): TreatmentScheduleParts => ({
  visitsPerPeriod: "", periodUnit: "week", duration: "", durationUnit: "weeks",
});

export const readCarePlanExtras = (row: { treatment_schedule?: unknown; exercise_info_link?: unknown }) => {
  const raw = row.treatment_schedule;
  const value = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  return {
    schedule: {
      visitsPerPeriod: typeof value.visitsPerPeriod === "string" ? value.visitsPerPeriod : "",
      periodUnit: value.periodUnit === "month" ? "month" as const : "week" as const,
      duration: typeof value.duration === "string" ? value.duration : "",
      durationUnit: value.durationUnit === "months" ? "months" as const : "weeks" as const,
    },
    exerciseInfoLink: typeof row.exercise_info_link === "string" ? row.exercise_info_link : "",
  };
};

export const serializeCarePlanExtras = (input: { schedule: TreatmentScheduleParts; exerciseInfoLink: string }) => ({
  treatment_schedule: { ...input.schedule },
  exercise_info_link: input.exerciseInfoLink.trim(),
});