
import { ReportItem as ReportItemType } from "@/types";
import { ReportItem } from "./ReportItem";
import { ReportStyle } from "./reportStyleVariants";

interface ReportSubcategoryProps {
  title: string;
  items: ReportItemType[];
  style: { bg: string; border: string; headerBg: string; headerText: string };
  variant?: ReportStyle;
}

export const ReportSubcategory = ({ title, items, style, variant = "classic" }: ReportSubcategoryProps) => {
  if (items.length === 0) return null;

  const containerClass =
    variant === "dashboard"
      ? "grid grid-cols-2 gap-3 items-start"
      : variant === "dossier"
      ? "space-y-4"
      : "space-y-3";

  return (
    <div className={containerClass}>
      {items.map(item => (
        <ReportItem key={item.id} item={item} style={style} variant={variant} />
      ))}
    </div>
  );
};
