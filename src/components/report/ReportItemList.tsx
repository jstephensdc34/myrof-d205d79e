
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ReportItem } from "@/types";

interface ReportItemListProps {
  items: ReportItem[];
  selectedItems: string[];
  onToggleItem: (itemId: string) => void;
}

export const ReportItemList = ({ 
  items, 
  selectedItems, 
  onToggleItem 
}: ReportItemListProps) => {
  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-md">
        <p>No items available in this category. Add items in the Library.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-md">
          <Checkbox
            id={item.id}
            checked={selectedItems.includes(item.id)}
            onCheckedChange={() => onToggleItem(item.id)}
          />
          <Label
            htmlFor={item.id}
            className="font-medium cursor-pointer"
          >
            {item.name}
          </Label>
        </div>
      ))}
    </div>
  );
};
