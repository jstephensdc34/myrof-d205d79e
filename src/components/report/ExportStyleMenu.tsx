import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { REPORT_STYLE_OPTIONS, ReportStyle } from "@/components/report/reportStyleVariants";

interface ExportStyleMenuProps {
  trigger: ReactNode;
  currentStyle: ReportStyle;
  onSelect: (style: ReportStyle) => void;
  disabled?: boolean;
}

/** Wraps an export button so the user picks a report style at click time. */
export const ExportStyleMenu = ({ trigger, currentStyle, onSelect, disabled }: ExportStyleMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild disabled={disabled}>
      {trigger}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center" className="w-64">
      <DropdownMenuLabel>Choose report style</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {REPORT_STYLE_OPTIONS.map((option) => (
        <DropdownMenuItem key={option.value} onSelect={() => onSelect(option.value)}>
          <span className="flex-1">{option.label}</span>
          {option.value === currentStyle && (
            <Check className="h-4 w-4 text-muted-foreground" aria-label="Current preview style" />
          )}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
