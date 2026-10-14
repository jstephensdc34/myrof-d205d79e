import { createContext, useContext, useId, useState, ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sanitizeHtml } from "@/components/ui/rich-text-editor";
import { ReportItem } from "@/types";
import { expandDescriptions, toggleDescription } from "@/utils/reportDisclosure";

const DisclosureContext = createContext({
  expanded: [] as string[],
  toggle: (_id: string) => {},
  expandAll: () => {},
  collapseAll: () => {},
  allExpanded: false,
  hasDescriptions: false,
});

export const ReportDisclosureProvider = ({ items, children }: { items: ReportItem[]; children: ReactNode }) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const descriptionIds = expandDescriptions(items);
  return (
    <DisclosureContext.Provider value={{
      expanded,
      toggle: (id) => setExpanded((previous) => toggleDescription(previous, id)),
      expandAll: () => setExpanded(descriptionIds),
      collapseAll: () => setExpanded([]),
      allExpanded: descriptionIds.length > 0 && descriptionIds.every((id) => expanded.includes(id)),
      hasDescriptions: descriptionIds.length > 0,
    }}>
      {children}
    </DisclosureContext.Provider>
  );
};

export const ReportExpansionControls = () => {
  const { expandAll, collapseAll, allExpanded, hasDescriptions } = useContext(DisclosureContext);
  if (!hasDescriptions) return null;
  return (
    <div className="flex justify-end gap-2 print:hidden" data-html2canvas-ignore="true" data-report-controls>
      <Button type="button" size="sm" variant="outline" onClick={allExpanded ? collapseAll : expandAll}
        data-expand-all aria-expanded={allExpanded}>
        <span data-expand-label>{allExpanded ? "Collapse All" : "Expand All"}</span>
        <ChevronsDown data-expand-down className={allExpanded ? "hidden" : ""} />
        <ChevronsUp data-expand-up className={allExpanded ? "" : "hidden"} />
      </Button>
    </div>
  );
};

export const ReportDescription = ({ itemId, definition, description }: {
  itemId: string; definition?: string; description?: string;
}) => {
  const { expanded, toggle } = useContext(DisclosureContext);
  const contentId = useId();
  const isExpanded = expanded.includes(itemId);
  const safeDescription = description ? sanitizeHtml(description) : "";
  const hasDescription = safeDescription.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
  return (
    <div className="space-y-1.5" data-report-item>
      <p className="text-sm text-foreground/80">{definition || "No definition provided."}</p>
      {hasDescription && <>
        <Button type="button" variant="link" className="h-8 px-0 text-xs text-muted-foreground print:hidden"
          data-html2canvas-ignore="true" data-description-toggle
          aria-expanded={isExpanded} aria-controls={contentId} onClick={() => toggle(itemId)}>
          <span data-disclosure-label>{isExpanded ? "Show Less" : "Read More"}</span>
          <ChevronDown data-chevron-down className={isExpanded ? "hidden" : ""} />
          <ChevronUp data-chevron-up className={isExpanded ? "" : "hidden"} />
        </Button>
        <div id={contentId} hidden={!isExpanded} data-description
          className="prose prose-sm max-w-none break-words text-sm text-foreground/80"
          dangerouslySetInnerHTML={{ __html: safeDescription }} />
      </>}
    </div>
  );
};