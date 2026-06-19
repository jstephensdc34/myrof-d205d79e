import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  ReportSetting,
  upsertSettingByName,
} from "@/services/reportSettingsService";
import {
  DEFAULT_EMAIL_BODY,
  DEFAULT_EMAIL_SUBJECT,
  DEFAULT_FULL_BUTTON_LABEL,
  DEFAULT_OVERVIEW_BUTTON_LABEL,
  EMAIL_TEMPLATE_SETTING_KEYS,
  EMAIL_TEMPLATE_TOKENS,
} from "@/utils/emailTemplateDefaults";

interface EmailTemplateFormProps {
  settings: ReportSetting[];
  onSettingUpdated: (updatedSetting: ReportSetting) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const getValue = (settings: ReportSetting[], name: string, fallback: string) =>
  settings.find((s) => s.name === name)?.value || fallback;

export const EmailTemplateForm = ({
  settings,
  onSettingUpdated,
  isAuthenticated,
  loading,
}: EmailTemplateFormProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    subject: DEFAULT_EMAIL_SUBJECT,
    body: DEFAULT_EMAIL_BODY,
    fullButton: DEFAULT_FULL_BUTTON_LABEL,
    overviewButton: DEFAULT_OVERVIEW_BUTTON_LABEL,
  });

  useEffect(() => {
    setForm({
      subject: getValue(settings, EMAIL_TEMPLATE_SETTING_KEYS.subject, DEFAULT_EMAIL_SUBJECT),
      body: getValue(settings, EMAIL_TEMPLATE_SETTING_KEYS.body, DEFAULT_EMAIL_BODY),
      fullButton: getValue(settings, EMAIL_TEMPLATE_SETTING_KEYS.fullButton, DEFAULT_FULL_BUTTON_LABEL),
      overviewButton: getValue(settings, EMAIL_TEMPLATE_SETTING_KEYS.overviewButton, DEFAULT_OVERVIEW_BUTTON_LABEL),
    });
  }, [settings]);

  const handleChange = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleRestore = () => {
    setForm({
      subject: DEFAULT_EMAIL_SUBJECT,
      body: DEFAULT_EMAIL_BODY,
      fullButton: DEFAULT_FULL_BUTTON_LABEL,
      overviewButton: DEFAULT_OVERVIEW_BUTTON_LABEL,
    });
    toast({
      title: "Defaults restored",
      description: "Click Save Template to keep the changes.",
    });
  };

  const handleCopyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      toast({ title: "Copied", description: `${token} copied to clipboard` });
    } catch {
      toast({
        title: "Copy failed",
        description: "Couldn't access the clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to update the email template",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const results = await Promise.all([
        upsertSettingByName(EMAIL_TEMPLATE_SETTING_KEYS.subject, form.subject),
        upsertSettingByName(EMAIL_TEMPLATE_SETTING_KEYS.body, form.body),
        upsertSettingByName(EMAIL_TEMPLATE_SETTING_KEYS.fullButton, form.fullButton),
        upsertSettingByName(EMAIL_TEMPLATE_SETTING_KEYS.overviewButton, form.overviewButton),
      ]);
      results.forEach(onSettingUpdated);
      toast({ title: "Success", description: "Email template saved" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const disabled = loading || !isAuthenticated || isSaving;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-lg">Patient Email Template</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Customize the prefilled email sent with each report. Tokens below get replaced automatically.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="emailSubject">Subject</Label>
          <Input
            id="emailSubject"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="emailBody">Body</Label>
          <Textarea
            id="emailBody"
            value={form.body}
            onChange={(e) => handleChange("body", e.target.value)}
            disabled={disabled}
            rows={12}
            className="font-mono text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="fullButton">"Full Report" button label</Label>
            <Input
              id="fullButton"
              value={form.fullButton}
              onChange={(e) => handleChange("fullButton", e.target.value)}
              disabled={disabled}
            />
          </div>
          <div>
            <Label htmlFor="overviewButton">"Overview" button label</Label>
            <Input
              id="overviewButton"
              value={form.overviewButton}
              onChange={(e) => handleChange("overviewButton", e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-muted/40 p-3">
        <p className="text-sm font-medium mb-2">Available tokens (click to copy)</p>
        <div className="flex flex-wrap gap-2">
          {EMAIL_TEMPLATE_TOKENS.map((t) => (
            <button
              key={t.token}
              type="button"
              onClick={() => handleCopyToken(t.token)}
              title={t.description}
              className="rounded-full bg-background border px-3 py-1 text-xs font-mono hover:bg-accent transition-colors"
            >
              {t.token}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <Button variant="outline" onClick={handleRestore} disabled={disabled}>
          Restore defaults
        </Button>
        <Button onClick={handleSave} disabled={disabled}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Template"
          )}
        </Button>
      </div>
    </div>
  );
};