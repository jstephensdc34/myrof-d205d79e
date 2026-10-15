import { expect, it } from "bun:test";
import { composeReportEmail } from "../src/utils/composeReportEmail";

it("sends only the Overview URL when an older saved template has both versions", () => {
  const result = composeReportEmail({
    patientName: "Test", clinicName: "Clinic", overviewReportUrl: "https://example.com/overview",
    templates: { body: "Hi {{patient_name}}\n{{full_button_label}}: {{full_report_url}}\n{{overview_button_label}}: {{overview_report_url}}" },
  });
  expect(result.body.match(/https:\/\/example.com\/overview/g)?.length).toBe(1);
  expect(result.html.match(/href="https:\/\/example.com\/overview"/g)?.length).toBe(1);
  expect(result.body.includes("Full Report")).toBe(false);
});

it("renders the report button as a table with bgcolor so Outlook shows it", () => {
  const result = composeReportEmail({
    patientName: "Test", clinicName: "Clinic", overviewReportUrl: "https://example.com/overview",
  });
  expect(result.html.includes('bgcolor="#059669"')).toBe(true);
  expect(result.html.includes("<table")).toBe(true);
  expect(result.html.match(/href="https:\/\/example.com\/overview"/g)?.length).toBe(1);
});