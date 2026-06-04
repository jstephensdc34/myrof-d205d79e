
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportItem, CategoryType } from "@/types";
import { ItemFormContent } from "./ItemFormContent";

interface ItemFormDialogProps {
  activeCategory: CategoryType;
  onSaveItem: (item: Partial<ReportItem> | ReportItem) => void;
  editingItem: ReportItem | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  isSubmitting?: boolean;
  availableSubcategories: {
    id: string;
    name: string;
    parentCategoryId?: string;
    description?: string;
  }[];
}

export const ItemFormDialog = ({
  activeCategory,
  onSaveItem,
  editingItem,
  isDialogOpen,
  setIsDialogOpen,
  isSubmitting = false,
  availableSubcategories,
}: ItemFormDialogProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {editingItem ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <ItemFormContent
            activeCategory={activeCategory}
            onSaveItem={onSaveItem}
            editingItem={editingItem}
            isSubmitting={isSubmitting}
            availableSubcategories={availableSubcategories}
            setIsDialogOpen={setIsDialogOpen}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
