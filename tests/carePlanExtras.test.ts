import { describe, expect, it } from "bun:test";
import { readCarePlanExtras, serializeCarePlanExtras } from "../src/utils/carePlanExtras";

describe("template extras", () => {
  it("round trips frequency, duration and their units", () => {
    const schedule = { visitsPerPeriod: "3", periodUnit: "month" as const, duration: "4", durationUnit: "months" as const };
    expect(readCarePlanExtras(serializeCarePlanExtras({ schedule, exerciseInfoLink: "" })).schedule).toEqual(schedule);
  });
  it("round trips the exercise instructions link", () => {
    expect(readCarePlanExtras(serializeCarePlanExtras({ schedule: {}, exerciseInfoLink: "https://example.com/exercises" })).exerciseInfoLink).toBe("https://example.com/exercises");
  });
  it("loads old templates with blank inputs and default units", () => {
    expect(readCarePlanExtras({})).toEqual({ schedule: { visitsPerPeriod: "", periodUnit: "week", duration: "", durationUnit: "weeks" }, exerciseInfoLink: "" });
  });
  it("does not serialize patient-specific cost estimates", () => {
    const input = { schedule: {}, exerciseInfoLink: "", estimatedCost: "https://example.com/private-quote" };
    expect(serializeCarePlanExtras(input)).toEqual({ treatment_schedule: {}, exercise_info_link: "" });
  });
});