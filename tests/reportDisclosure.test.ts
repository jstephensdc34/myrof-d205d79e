import { describe, expect, it } from "bun:test";
import { expandDescriptions, toggleDescription } from "../src/utils/reportDisclosure";

describe("report description state", () => {
  it("starts collapsed and expands only the selected item", () => {
    const expanded = toggleDescription([], "diagnosis");
    expect(expanded).toEqual(["diagnosis"]);
    expect(expanded.includes("homecare")).toBe(false);
  });
  it("collapses one item without collapsing another", () => {
    expect(toggleDescription(["diagnosis", "homecare"], "diagnosis")).toEqual(["homecare"]);
  });
  it("expands all selected descriptions without including definition-only items", () => {
    expect(expandDescriptions([
      { id: "diagnosis", description: "Long clinical description" },
      { id: "modality", description: "Treatment details" },
      { id: "homecare", description: "" },
    ])).toEqual(["diagnosis", "modality"]);
  });
});