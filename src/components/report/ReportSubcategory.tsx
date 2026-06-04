
import { ReportItem as ReportItemType } from "@/types";
import { ReportItem } from "./ReportItem";

interface ReportSubcategoryProps {
  title: string;
  items: ReportItemType[];
  style: { bg: string; border: string; headerBg: string; headerText: string };
}

export const ReportSubcategory = ({ title, items, style }: ReportSubcategoryProps) => {
  if (items.length === 0) return null;
  
  return (
    <div className="space-y-3">
      {items.map(item => (
        <ReportItem key={item.id} item={item} style={style} />
      ))}
    </div>
  );
};
