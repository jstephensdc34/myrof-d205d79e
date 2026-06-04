
import { ReportItem } from '@/types';
import { renderReportItem } from './reportItemRenderer';
import { getOrderedSubcategories } from '@/utils/categoryUtils';
import { getSectionColors } from './reportStyles';

export const renderCategorySection = (
  categoryId: string, 
  categoryItems: ReportItem[], 
  categoryNames: Record<string, string>, 
  subcategories: any[],
  getSubcategoryName: (subcategoryId: string) => string
): string => {
  const colors = getSectionColors(categoryId);
  
  let html = `
    <div class="category-section">
      <div class="section-header" style="background:${colors.headerBg};">
        <h3>${categoryNames[categoryId] || categoryId}</h3>
      </div>
  `;

  const orderedSubcategories = getOrderedSubcategories(categoryId, subcategories);
  
  orderedSubcategories.forEach(subcategory => {
    const subcategoryItems = categoryItems.filter(item => item.subcategoryId === subcategory.id);
    if (subcategoryItems.length > 0) {
      html += subcategoryItems.map(item => renderReportItem(item, colors)).join('');
    }
  });
  
  const uncategorizedItems = categoryItems.filter(item => !item.subcategoryId);
  if (uncategorizedItems.length > 0) {
    html += uncategorizedItems.map(item => renderReportItem(item, colors)).join('');
  }

  html += `</div>`;
  return html;
};
