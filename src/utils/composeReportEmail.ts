import {
  DEFAULT_EMAIL_BODY,
  DEFAULT_EMAIL_SUBJECT,
  DEFAULT_OVERVIEW_BUTTON_LABEL,
  applyTokens,
} from "./emailTemplateDefaults";

export interface EmailTemplateOverrides {
  subject?: string;
  body?: string;
  overviewButtonLabel?: string;
}

export interface ComposeReportEmailParams {
  patientName: string;
  clinicName: string;
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
  overviewReportUrl,
  templates,
}: ComposeReportEmailParams): ComposedEmail => {
  const overviewButtonLabel =
    (templates?.overviewButtonLabel?.trim() || DEFAULT_OVERVIEW_BUTTON_LABEL);

  const vars: Record<string, string> = {
    patient_name: patientName || "",
    clinic_name: clinicName || "",
    full_report_url: overviewReportUrl,
    overview_report_url: overviewReportUrl,
    full_button_label: overviewButtonLabel,
    overview_button_label: overviewButtonLabel,
  };

  const subjectTemplate = templates?.subject?.trim()
    ? templates.subject
    : DEFAULT_EMAIL_SUBJECT;
  const rawBodyTemplate = templates?.body?.trim()
    ? templates.body
    : DEFAULT_EMAIL_BODY;
  // Older saved templates contain both links. Keep one Overview link without
  // requiring a settings migration or changing the user's other paragraphs.
  const hasOverviewToken = rawBodyTemplate.includes("overview_report_url");
  const bodyTemplate = rawBodyTemplate.split("\n")
    .filter((line) => !(hasOverviewToken && line.includes("full_report_url")))
    .join("\n");

  const subject = applyTokens(subjectTemplate, vars).trim();
  const body = applyTokens(bodyTemplate, vars);

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // Outlook desktop (Word rendering engine) ignores CSS backgrounds on <a>
  // tags, which left white text on a white background. Wrapping the link in a
  // table cell with a bgcolor attribute makes the button render in Outlook,
  // while Gmail and other clients keep the styled anchor.
  const button = (href: string, label: string, bg: string) => `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;margin:4px 8px 4px 0;">
      <tr><td align="center" bgcolor="${bg}" style="border-radius:6px;background:${bg};">
        <a href="${escape(href)}" target="_blank" style="display:inline-block;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600;font-family:Arial,Helvetica,sans-serif;font-size:14px;">${label}</a>
      </td></tr>
    </table>`;

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
    if (line.includes(overviewReportUrl)) {
      flush();
      paragraphs.push(`<p>${button(overviewReportUrl, escape(overviewButtonLabel), "#059669")}</p>`);
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
