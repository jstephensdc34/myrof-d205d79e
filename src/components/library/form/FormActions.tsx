
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  handleSave: () => void;
  isEditing: boolean;
}

export const FormActions = ({
  isSubmitting,
  setIsDialogOpen,
  handleSave,
  isEditing
}: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        onClick={() => setIsDialogOpen(false)} 
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        className="bg-medical-600" 
        onClick={handleSave}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Saving..." : "Adding..."}
          </>
        ) : (
          isEditing ? "Save Changes" : "Add Item"
        )}
      </Button>
    </div>
  );
};
