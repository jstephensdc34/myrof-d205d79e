export interface ComposeReportEmailParams {
  patientName: string;
  clinicName: string;
  fullReportUrl: string;
  overviewReportUrl: string;
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
}: ComposeReportEmailParams): ComposedEmail => {
  const subject = `Your Clinical Report of Findings & Care Plan${patientName ? ` – ${patientName}` : ""}`;

  const body = [
    `Hi${patientName ? ` ${patientName}` : ""},`,
    "",
    "Your Clinical Report of Findings & Care Plan is ready to view.",
    "",
    `▶ View Full Report: ${fullReportUrl}`,
    `▶ View Overview: ${overviewReportUrl}`,
    "",
    "Please reply to this email with any questions.",
    "",
    `— ${clinicName}`,
  ].join("\n");

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const button = (href: string, label: string, bg: string) => `
    <a href="${escape(href)}" style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600;font-family:Arial,Helvetica,sans-serif;font-size:14px;margin:4px 8px 4px 0;">${label}</a>`;

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;line-height:1.5;">
  <p>Hi${patientName ? ` ${escape(patientName)}` : ""},</p>
  <p>Your Clinical Report of Findings &amp; Care Plan is ready to view.</p>
  <p>
    ${button(fullReportUrl, "View Full Report", "#096dd9")}
    ${button(overviewReportUrl, "View Overview", "#059669")}
  </p>
  <p>Please reply to this email with any questions.</p>
  <p>— ${escape(clinicName)}</p>
</div>`.trim();

  return { subject, body, html };
};

export const buildMailtoUrl = ({ subject, body }: ComposedEmail): string => {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
