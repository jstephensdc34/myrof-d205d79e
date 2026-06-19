import {
  DEFAULT_EMAIL_BODY,
  DEFAULT_EMAIL_SUBJECT,
  DEFAULT_FULL_BUTTON_LABEL,
  DEFAULT_OVERVIEW_BUTTON_LABEL,
  applyTokens,
} from "./emailTemplateDefaults";

export interface EmailTemplateOverrides {
  subject?: string;
  body?: string;
  fullButtonLabel?: string;
  overviewButtonLabel?: string;
}

export interface ComposeReportEmailParams {
  patientName: string;
  clinicName: string;
  fullReportUrl: string;
  overviewReportUrl: string;
  templates?: EmailTemplateOverrides;
}

export interface ComposedEmail {
  subject: string;
  body: string;
  html: string;
}

export const composeReportEmail = ({
  patientName,
  clinicName,
  fullReportUrl,
  overviewReportUrl,
  templates,
}: ComposeReportEmailParams): ComposedEmail => {
  const fullButtonLabel =
    (templates?.fullButtonLabel?.trim() || DEFAULT_FULL_BUTTON_LABEL);
  const overviewButtonLabel =
    (templates?.overviewButtonLabel?.trim() || DEFAULT_OVERVIEW_BUTTON_LABEL);

  const vars: Record<string, string> = {
    patient_name: patientName || "",
    clinic_name: clinicName || "",
    full_report_url: fullReportUrl,
    overview_report_url: overviewReportUrl,
    full_button_label: fullButtonLabel,
    overview_button_label: overviewButtonLabel,
  };

  const subjectTemplate = templates?.subject?.trim()
    ? templates.subject
    : DEFAULT_EMAIL_SUBJECT;
  const bodyTemplate = templates?.body?.trim()
    ? templates.body
    : DEFAULT_EMAIL_BODY;

  const subject = applyTokens(subjectTemplate, vars).trim();
  const body = applyTokens(bodyTemplate, vars);

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const button = (href: string, label: string, bg: string) => `
    <a href="${escape(href)}" style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600;font-family:Arial,Helvetica,sans-serif;font-size:14px;margin:4px 8px 4px 0;">${label}</a>`;

  // Build HTML from the (token-resolved) plain-text body so customization
  // flows through. Lines containing the report URLs become styled buttons.
  const paragraphs: string[] = [];
  let buffer: string[] = [];
  const flush = () => {
    if (buffer.length === 0) return;
    const joined = buffer.join("<br />");
    paragraphs.push(`<p>${joined}</p>`);
    buffer = [];
  };

  const lines = body.split("\n");
  for (const rawLine of lines) {
    const line = rawLine;
    if (line.trim() === "") {
      flush();
      continue;
    }
    if (line.includes(fullReportUrl) || line.includes(overviewReportUrl)) {
      flush();
      const isFull = line.includes(fullReportUrl);
      const url = isFull ? fullReportUrl : overviewReportUrl;
      const label = isFull ? fullButtonLabel : overviewButtonLabel;
      const color = isFull ? "#096dd9" : "#059669";
      paragraphs.push(`<p>${button(url, label, color)}</p>`);
      continue;
    }
    buffer.push(escape(line));
  }
  flush();

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;line-height:1.5;">
  ${paragraphs.join("\n  ")}
</div>`.trim();

  return { subject, body, html };
};

export const buildMailtoUrl = ({ subject, body }: ComposedEmail): string => {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
