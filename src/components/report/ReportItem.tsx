
import { ReportItem as ReportItemType } from "@/types";
import { InfoLink } from "./InfoLink";
import { sanitizeHtml } from "@/components/ui/rich-text-editor";
import { ReportStyle, DOSSIER_ACCENT, DOSSIER_ACCENT_SOFT } from "./reportStyleVariants";

interface ReportItemProps {
  item: ReportItemType;
  style: { bg: string; border: string; headerBg: string; headerText: string };
  variant?: ReportStyle;
}

export const ExternalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const ReportItem = ({ item, style, variant = "classic" }: ReportItemProps) => {
  const body = (
    <>
      {item.definition && (
        <p className="text-sm text-foreground/80">{item.definition}</p>
      )}
      {item.description && (
        <div
          className="prose prose-sm text-foreground/70 text-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description) }}
        />
      )}
    </>
  );

  if (variant === "dossier") {
    return (
      <div className="pl-4 py-1" style={{ borderLeft: `2px solid ${DOSSIER_ACCENT_SOFT}` }}>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold tracking-tight" style={{ color: DOSSIER_ACCENT }}>
            {item.name}
          </h4>
          {item.infoLink && <InfoLink link={item.infoLink} />}
        </div>
        <div className="mt-1.5 space-y-1.5">{body}</div>
        {item.infoLink && (
          <a
            href={item.infoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:opacity-90"
            style={{ backgroundColor: DOSSIER_ACCENT }}
          >
            More Information
            <ExternalIcon />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${style.border} ${style.bg} overflow-hidden shadow-sm`}>
      <div className={`px-4 py-2 ${style.headerBg} flex items-center gap-2`}>
        <h4 className={`font-semibold text-sm ${style.headerText}`}>
          {item.name}
        </h4>
        {item.infoLink && <InfoLink link={item.infoLink} />}
      </div>
      <div className="px-4 py-3 space-y-2">
        {body}
        {item.infoLink && (
          <a
            href={item.infoLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:opacity-90 ${style.headerBg}`}
          >
            More Information
            <ExternalIcon />
          </a>
        )}
      </div>
    </div>
  );
};
