import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TreatmentScheduleFormProps {
  visitsPerPeriod: string;
  periodUnit: "week" | "month";
  duration: string;
  durationUnit: "weeks" | "months";
  onVisitsPerPeriodChange: (value: string) => void;
  onPeriodUnitChange: (value: "week" | "month") => void;
  onDurationChange: (value: string) => void;
  onDurationUnitChange: (value: "weeks" | "months") => void;
}

export const TreatmentScheduleForm = ({
  visitsPerPeriod,
  periodUnit,
  duration,
  durationUnit,
  onVisitsPerPeriodChange,
  onPeriodUnitChange,
  onDurationChange,
  onDurationUnitChange,
}: TreatmentScheduleFormProps) => {
  return (
    <div className="rounded-md border bg-muted/40 p-4 space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Treatment Frequency & Duration</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="visits-per-period" className="text-xs text-muted-foreground">
              Visits per
            </Label>
            <div className="flex gap-2">
              <Input
                id="visits-per-period"
                type="number"
                min="1"
                placeholder="e.g. 3"
                value={visitsPerPeriod}
                onChange={(e) => onVisitsPerPeriodChange(e.target.value)}
                className="w-24"
              />
              <Select value={periodUnit} onValueChange={(v) => onPeriodUnitChange(v as "week" | "month")}>
                <SelectTrigger className="flex-1" aria-label="Visits per week or month">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="treatment-duration" className="text-xs text-muted-foreground">
              Duration
            </Label>
            <div className="flex gap-2">
              <Input
                id="treatment-duration"
                type="number"
                min="1"
                placeholder="e.g. 6"
                value={duration}
                onChange={(e) => onDurationChange(e.target.value)}
                className="w-24"
              />
              <Select value={durationUnit} onValueChange={(v) => onDurationUnitChange(v as "weeks" | "months")}>
                <SelectTrigger className="flex-1" aria-label="Duration in weeks or months">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          e.g. 3 visits per week for 6 weeks — shown in the Treatment Plan section of the report.
        </p>
      </div>
    </div>
  );
};
