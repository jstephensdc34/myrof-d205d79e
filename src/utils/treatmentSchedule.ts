interface TreatmentScheduleParts {
  visitsPerPeriod?: string;
  periodUnit?: "week" | "month";
  duration?: string;
  durationUnit?: "weeks" | "months";
}

const pluralize = (value: string, unit: string): string => {
  const n = Number(value);
  const singular = unit.replace(/s$/, "");
  if (n === 1) return singular;
  return unit;
};

/**
 * Composes a human-readable treatment schedule sentence, e.g.
 * "3 visits per week for 6 weeks". Handles partial entries gracefully
 * and returns an empty string when nothing is entered.
 */
export const composeTreatmentSchedule = ({
  visitsPerPeriod,
  periodUnit,
  duration,
  durationUnit,
}: TreatmentScheduleParts): string => {
  const visits = (visitsPerPeriod || "").trim();
  const dur = (duration || "").trim();

  const frequencyPart = visits
    ? `${visits} visit${visits === "1" ? "" : "s"} per ${periodUnit || "week"}`
    : "";

  const durationPart = dur
    ? `${dur} ${pluralize(dur, durationUnit || "weeks")}`
    : "";

  if (frequencyPart && durationPart) {
    return `${frequencyPart} for ${durationPart}`;
  }
  if (frequencyPart) return frequencyPart;
  if (durationPart) return `${durationPart} of care`;
  return "";
};
