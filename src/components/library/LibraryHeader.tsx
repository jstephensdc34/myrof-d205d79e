
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LibraryHeaderProps {
  onAddNewItem: () => void;
  isSubmitting: boolean;
}

export const LibraryHeader = ({ 
  onAddNewItem,
  isSubmitting 
}: LibraryHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Report Library</h1>
      <Button 
        className="bg-medical-600 hover:bg-medical-700"
        onClick={onAddNewItem}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add New Item"
        )}
      </Button>
    </div>
  );
};
