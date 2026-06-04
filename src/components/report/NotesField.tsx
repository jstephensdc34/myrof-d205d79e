
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface NotesFieldProps {
  notes: string;
  onChange: (notes: string) => void;
}

export const NotesField = ({ notes, onChange }: NotesFieldProps) => {
  return (
    <Card className="mt-6">
      <CardHeader className="bg-medical-600">
        <CardTitle className="text-white">Additional Notes</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Textarea 
          className="min-h-[150px]" 
          placeholder="Enter any additional notes or instructions here..."
          value={notes}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
};
