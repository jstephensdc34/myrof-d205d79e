
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { LoadStarterLibraryButton } from "@/components/library/LoadStarterLibraryButton";
import { useLibraryItemCount } from "@/hooks/library/useLibraryItemCount";

interface LibraryHeaderProps {
  onAddNewItem: () => void;
  isSubmitting: boolean;
}

export const LibraryHeader = ({ 
  onAddNewItem,
  isSubmitting 
}: LibraryHeaderProps) => {
  const { count, refresh } = useLibraryItemCount();
  const showStarterButton = count === 0;
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Report Library</h1>
      <div className="flex items-center gap-2">
        {showStarterButton && (
          <LoadStarterLibraryButton onComplete={() => refresh()} />
        )}
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
    </div>
  );
};
