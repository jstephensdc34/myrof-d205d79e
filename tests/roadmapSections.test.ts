import { describe, expect, it } from "bun:test";
import { getRoadmapSection } from "../src/utils/roadmapSections";
import { isReportStyle } from "../src/components/report/reportStyleVariants";

const item = (categoryId: string, subcategoryId?: string) => ({ id: "test", name: "Clinical item", description: "Details", categoryId, subcategoryId });

describe("Chronological Roadmap mapping", () => {
  it("places spinal and extremity diagnoses in The Problem", () => {
    expect(getRoadmapSection(item("diagnosis"))).toBe("problem");
    expect(getRoadmapSection(item("extremity"))).toBe("problem");
  });
  it("places care plan type, phase of care and goals in The Plan", () => {
    for (const subcategory of ["care_plan_type", "phase_of_care", "treatment_goals"]) {
      expect(getRoadmapSection(item("treatment", subcategory))).toBe("plan");
    }
  });
  it("places treatment modalities in In-Clinic Plan", () => {
    expect(getRoadmapSection(item("treatment", "treatment_modalities"))).toBe("clinic");
  });
  it("places all home care, ADLs and exercises in At-Home Plan", () => {
    expect(getRoadmapSection(item("homecare"))).toBe("home");
    expect(getRoadmapSection(item("homecare", "adls"))).toBe("home");
    expect(getRoadmapSection(item("exercises"))).toBe("home");
  });
  it("accepts the new style for saved defaults and export choices", () => {
    expect(isReportStyle("roadmap")).toBe(true);
    expect(isReportStyle("invalid")).toBe(false);
  });
});