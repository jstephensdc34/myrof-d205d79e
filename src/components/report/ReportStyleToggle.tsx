import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, LayoutGrid, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ReportStyle,
  REPORT_STYLE_OPTIONS,
  REPORT_STYLE_SETTING_NAME,
} from "./reportStyleVariants";
import { createSetting, updateSetting, ReportSetting } from "@/services/reportSettingsService";

interface ReportStyleToggleProps {
  value: ReportStyle;
  onChange: (style: ReportStyle) => void;
  settings: ReportSetting[];
  onSaved?: () => void;
}

export const ReportStyleToggle = ({ value, onChange, settings, onSaved }: ReportStyleToggleProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const savedDefault = settings.find((s) => s.name === REPORT_STYLE_SETTING_NAME)?.value;
  const isDefault = savedDefault === value;

  const handleSetDefault = async () => {
    try {
      setSaving(true);
      if (savedDefault !== undefined) {
        await updateSetting(REPORT_STYLE_SETTING_NAME, value);
      } else {
        await createSetting(REPORT_STYLE_SETTING_NAME, value);
      }
      toast({
        title: "Default style saved",
        description: "This layout will load automatically next time.",
      });
      onSaved?.();
    } catch (err) {
      toast({
        title: "Could not save default",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="my-4">
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <LayoutGrid className="h-4 w-4" />
            Report Style
          </span>
          {REPORT_STYLE_OPTIONS.map((option) => (
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
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleSetDefault}
          disabled={saving || isDefault}
          className="self-start sm:self-auto"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isDefault ? (
            <Check className="mr-2 h-4 w-4" />
          ) : null}
          {isDefault ? "Current Default" : "Set as Default Style"}
        </Button>
      </CardContent>
    </Card>
  );
};
