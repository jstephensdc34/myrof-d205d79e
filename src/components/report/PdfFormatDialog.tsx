import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";

export type PdfFormat = "full" | "overview";

interface PdfFormatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (format: PdfFormat) => void;
}

export const PdfFormatDialog = ({ open, onOpenChange, onSelect }: PdfFormatDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate PDF Report</DialogTitle>
          <DialogDescription>
            Choose which version of the report you'd like to download.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => onSelect("full")}
            className="w-full bg-medical-700 hover:bg-medical-800"
          >
            <FileText className="mr-2 h-4 w-4" />
            Full Report PDF
          </Button>
          <Button
            onClick={() => onSelect("overview")}
            variant="outline"
            className="w-full border-medical-600 text-medical-700 hover:bg-medical-50"
          >
            <FileText className="mr-2 h-4 w-4" />
            Overview Report PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
