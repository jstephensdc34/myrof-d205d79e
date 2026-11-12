import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CostEstimateField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <Card className="mt-6">
    <CardHeader className="bg-muted border-b"><CardTitle className="text-foreground text-lg">Cost Estimate / Financial Summary</CardTitle></CardHeader>
    <CardContent className="pt-6">
      <Label htmlFor="cost-estimate">Estimate or link (Optional)</Label>
      <Input id="cost-estimate" className="mt-2" placeholder="e.g. $50 per visit or https://…" value={value} onChange={(event) => onChange(event.target.value)} />
    </CardContent>
  </Card>
);