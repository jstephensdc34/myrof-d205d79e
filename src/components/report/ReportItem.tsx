
import { ReportItem as ReportItemType } from "@/types";
import { InfoLink } from "./InfoLink";
import { sanitizeHtml } from "@/components/ui/rich-text-editor";

interface ReportItemProps {
  item: ReportItemType;
  style: { bg: string; border: string; headerBg: string; headerText: string };
}

export const ReportItem = ({ item, style }: ReportItemProps) => {
  return (
    <div className={`rounded-lg border ${style.border} ${style.bg} overflow-hidden shadow-sm`}>
      <div className={`px-4 py-2 ${style.headerBg} flex items-center gap-2`}>
        <h4 className={`font-semibold text-sm ${style.headerText}`}>
          {item.name}
        </h4>
        {item.infoLink && <InfoLink link={item.infoLink} />}
      </div>
      <div className="px-4 py-3 space-y-2">
        {item.definition && (
          <p className="text-sm text-foreground/80">{item.definition}</p>
        )}
        {item.description && (
          <div 
            className="prose prose-sm text-foreground/70 text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}
          />
        )}
        {item.infoLink && (
          <p className="text-xs text-muted-foreground italic">
            For more information: {item.infoLink}
          </p>
        )}
      </div>
    </div>
  );
};
