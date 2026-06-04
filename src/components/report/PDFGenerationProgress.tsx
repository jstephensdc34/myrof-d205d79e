
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RenderPdfProgress } from "@/utils/pdf";
import { FileDown, FileText, Loader2 } from "lucide-react";

interface PDFGenerationProgressProps {
  progress: RenderPdfProgress;
}

export const PDFGenerationProgress: React.FC<PDFGenerationProgressProps> = ({ progress }) => {
  const statusMessages = {
    preparing: "Preparing document...",
    rendering: "Rendering content...",
    generating: "Creating PDF...",
    finalizing: "Finalizing document...",
    complete: "PDF generated successfully!",
  };

  const statusIcons = {
    preparing: <Loader2 className="h-5 w-5 animate-spin text-medical-600" />,
    rendering: <Loader2 className="h-5 w-5 animate-spin text-medical-600" />,
    generating: <FileText className="h-5 w-5 text-medical-600" />,
    finalizing: <Loader2 className="h-5 w-5 animate-spin text-medical-600" />,
    complete: <FileDown className="h-5 w-5 text-green-600" />,
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          {statusIcons[progress.status]}
          <span className="text-sm font-medium">
            {statusMessages[progress.status]}
          </span>
        </div>
        <Progress value={progress.percentage} className="h-2" />
      </CardContent>
      <CardFooter className="pt-2 pb-4 text-xs text-gray-500">
        {progress.status === "complete" 
          ? "Your PDF has been downloaded." 
          : "Please don't refresh the page while generating..."}
      </CardFooter>
    </Card>
  );
};
