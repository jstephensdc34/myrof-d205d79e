import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { loadStarterLibrary } from "@/services/library/loadStarterLibrary";

interface Props {
  onComplete?: () => void;
}

export const LoadStarterLibraryButton = ({ onComplete }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    setOpen(false);
    setIsLoading(true);
    const t = toast.loading("Loading starter library…");
    try {
      const { inserted } = await loadStarterLibrary(({ inserted, total }) => {
        toast.loading(`Loading starter library… ${inserted}/${total}`, {
          id: t,
        });
      });
      toast.success(`Imported ${inserted} starter items.`, { id: t });
      onComplete?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Load starter library failed:", err);
      toast.error(message, { id: t, duration: 8000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading…
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Load Starter Library
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Load the starter library?</AlertDialogTitle>
          <AlertDialogDescription>
            This adds the curated starter content shipped with your
            deployment to your library. You'll be able to edit, add, or
            delete any item afterward. This button disappears once the
            library has items.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Load library
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};