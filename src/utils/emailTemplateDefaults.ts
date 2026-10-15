export const DEFAULT_EMAIL_SUBJECT =
  "Your Clinical Report of Findings & Care Plan – {{patient_name}}";

export const DEFAULT_EMAIL_BODY = [
  "Hi {{patient_name}},",
  "",
  "Your clinical report and care plan is ready to view. Click the link below to see this report.",
  "",
  "▶ {{overview_button_label}}: {{overview_report_url}}",
  "",
  "In the report, each item starts with a short summary — click \"Read More\" on any item to expand the full explanation.",
  "",
  "Some items include a \"Learn More\" button that links to a helpful website or video for further explanation.",
  "",
  "Please reply to this email with any questions.",
  "",
  "— {{clinic_name}}",
].join("\n");

export const DEFAULT_OVERVIEW_BUTTON_LABEL = "View Report";

export const EMAIL_TEMPLATE_SETTING_KEYS = {
  subject: "email_subject_template",
  body: "email_body_template",
  overviewButton: "email_button_label_overview",
} as const;

export const EMAIL_TEMPLATE_TOKENS: { token: string; description: string }[] = [
  { token: "{{patient_name}}", description: "Patient's name" },
  { token: "{{clinic_name}}", description: "Your clinic name" },
  { token: "{{overview_report_url}}", description: "Link to the report" },
  { token: "{{overview_button_label}}", description: "Label of the report button (body only)" },
];

export const applyTokens = (
  template: string,
  vars: Record<string, string>
): string => {
  let out = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) =>
    vars[key] !== undefined ? vars[key] : ""
  );
  // Collapse lines that became empty after token replacement
  out = out
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n");
  // Tidy stray " – " left when patient_name is empty in subject
  out = out.replace(/\s+–\s*$/g, "").replace(/\s+-\s*$/g, "");
  return out;
};
