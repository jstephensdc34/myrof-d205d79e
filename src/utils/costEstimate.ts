export const parseCostEstimate = (raw: string): { text: string; url: string } => {
  const value = raw.trim();
  if (!value) return { text: "", url: "" };
  const looksLikeUrl = /^https?:\/\//i.test(value) || /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/:?#]|$)/i.test(value);
  if (looksLikeUrl) {
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      if (["http:", "https:"].includes(url.protocol) && !url.username && !url.password) return { text: "", url: url.href };
    } catch { /* Malformed input is displayed as plain text, never executed. */ }
  }
  return { text: value, url: "" };
};