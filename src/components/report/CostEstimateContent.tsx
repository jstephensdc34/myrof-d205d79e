import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseCostEstimate } from "@/utils/costEstimate";

export const CostEstimateContent = ({ value }: { value: string }) => {
  const { text, url } = parseCostEstimate(value);
  return <div className="space-y-3">
    {url ? <Button asChild variant="outline" size="sm" className="max-w-full whitespace-normal h-auto min-h-9">
      <a href={url} target="_blank" rel="noopener noreferrer">View Cost Estimate <ExternalLink className="h-4 w-4" /></a>
    </Button> : <p className="whitespace-pre-wrap break-words text-lg font-semibold text-foreground">{text}</p>}
    <p className="text-xs italic text-muted-foreground">This estimate is patient-specific. Please refer to your financial breakdown for billing, insurance, and payment details.</p>
  </div>;
};