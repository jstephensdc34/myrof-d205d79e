import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PanelsTopLeft } from "lucide-react";

export type UILayout = "ui-dossier" | "ui-modular" | "ui-workspace";

export const UI_LAYOUT_OPTIONS: { value: UILayout; label: string }[] = [
  { value: "ui-dossier", label: "Option A: Vertical" },
  { value: "ui-modular", label: "Option B: Side by Side" },
  { value: "ui-workspace", label: "Option C: Hybrid" },
];

interface UILayoutSwitcherProps {
  value: UILayout;
  onChange: (layout: UILayout) => void;
}

// Client-side preview switcher for app UI layout variations.
// State lives in the Report page (useState) — nothing is persisted.
export const UILayoutSwitcher = ({ value, onChange }: UILayoutSwitcherProps) => {
  return (
    <Card className="mb-6 border-dashed">
      <CardContent className="flex flex-wrap items-center gap-2 py-3">
        <span className="mr-1 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <PanelsTopLeft className="h-4 w-4" />
          UI Layout Preview
        </span>
        {UI_LAYOUT_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={value === option.value ? "default" : "outline"}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
