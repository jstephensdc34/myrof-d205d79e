import type { ReportItem } from "@/types";

export type RoadmapSection = "problem" | "plan" | "clinic" | "home";

export const getRoadmapSection = (item: ReportItem): RoadmapSection | undefined => {
  if (item.categoryId === "diagnosis" || item.categoryId === "extremity") return "problem";
  if (item.categoryId === "homecare" || item.categoryId === "exercises") return "home";
  if (item.categoryId === "treatment") {
    if (item.subcategoryId === "treatment_modalities") return "clinic";
    // Keep uncategorized/custom treatment entries visible alongside the care plan.
    return "plan";
  }
  return undefined;
};