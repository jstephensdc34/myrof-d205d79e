
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
        ${item.infoLink ? `<p class="item-link">For more information: <a href="${item.infoLink}" target="_blank" rel="noopener">${item.infoLink}</a></p>` : ''}
      </div>
    </div>
  `;
};
