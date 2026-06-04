
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface CustomTreatmentGoalsProps {
  goals: string;
  onChange: (goals: string) => void;
}

export const CustomTreatmentGoals = ({ goals, onChange }: CustomTreatmentGoalsProps) => {
  return (
    <Card className="mt-6">
      <CardHeader className="bg-medical-600">
        <CardTitle className="text-white">Additional Treatment Goals</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Textarea 
          className="min-h-[150px]" 
          placeholder="Enter any custom treatment goals for this patient..."
          value={goals}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
};
