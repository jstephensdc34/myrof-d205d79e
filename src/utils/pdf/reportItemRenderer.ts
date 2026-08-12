
import { ReportItem } from '@/types';
import { sanitizeHtml } from '@/components/ui/rich-text-editor';

export const renderReportItem = (item: ReportItem, colors: { bg: string; headerBg: string; border: string }): string => {
  return `
    <div class="item-card" style="border:1px solid ${colors.border};background:${colors.bg};">
      <div class="item-card-header" style="background:${colors.headerBg};">
        <h4>${item.name}</h4>
        ${item.infoLink ? `<a href="${item.infoLink}" class="info-link" target="_blank" rel="noopener">[info]</a>` : ''}
      </div>
      <div class="item-card-body">
        ${item.definition ? `<p class="definition">${item.definition}</p>` : ''}
        ${item.description ? `<div class="description">${sanitizeHtml(item.description)}</div>` : ''}
        ${item.infoLink ? `<a href="${item.infoLink}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;border-radius:6px;padding:6px 12px;background:${colors.headerBg};color:#fff;font-size:12px;font-weight:600;text-decoration:none;box-shadow:0 1px 2px rgba(0,0,0,0.1);">More Information <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
      </div>
    </div>
  `;
};
