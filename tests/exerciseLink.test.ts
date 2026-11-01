import { describe, expect, it } from "bun:test";
import { getExerciseLink } from "../src/utils/exerciseLink";

describe("exercise instructions link", () => {
  it("keeps a full https URL unchanged", () => {
    expect(getExerciseLink("https://hpiu.com/ankle-instructions")).toBe(
      "https://hpiu.com/ankle-instructions"
    );
  });

  it("prepends https:// when the clinician types a bare domain", () => {
    expect(getExerciseLink("hpiu.com/ankle-instructions")).toBe(
      "https://hpiu.com/ankle-instructions"
    );
  });

  it("returns empty for blank input so no link card renders", () => {
    expect(getExerciseLink("   ")).toBe("");
    expect(getExerciseLink(undefined)).toBe("");
  });
});
