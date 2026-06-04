import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Check, Loader2, Link } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ShareReportFormat } from "@/utils/shareReport";

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string | null;
  isLoading: boolean;
  onShare: (format: ShareReportFormat) => void;
}

export const ShareReportDialog = ({
  open,
  onOpenChange,
  shareUrl,
  isLoading,
  onShare,
}: ShareReportDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "The report link has been copied to your clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
          <DialogDescription>
            Choose a report format and generate a shareable link.
          </DialogDescription>
        </DialogHeader>

        {!shareUrl && !isLoading && (
          <div className="flex flex-col gap-3">
            <Button onClick={() => onShare("full")} className="w-full bg-medical-700 hover:bg-medical-800">
              <Link className="mr-2 h-4 w-4" />
              Share Full Report
            </Button>
            <Button onClick={() => onShare("overview")} variant="outline" className="w-full border-medical-600 text-medical-700 hover:bg-medical-50">
              <Link className="mr-2 h-4 w-4" />
              Share Overview Report
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-medical-700 mr-2" />
            <span>Generating report link...</span>
          </div>
        )}

        {shareUrl && (
          <div className="flex items-center gap-2">
            <Input value={shareUrl} readOnly className="flex-1 text-sm" />
            <Button size="icon" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
