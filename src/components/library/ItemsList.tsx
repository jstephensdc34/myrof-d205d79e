
import { ReportItem } from "@/types";
import { ItemCard } from "./ItemCard";

interface ItemsListProps {
  items: ReportItem[];
  onEdit: (item: ReportItem) => void;
  onDelete: (id: string) => void;
  categoryName: string;
}

export const ItemsList = ({ items, onEdit, onDelete, categoryName }: ItemsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.length === 0 ? (
        <div className="col-span-3 p-8 bg-white rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500">No items found in this category. Add a new item to get started.</p>
        </div>
      ) : (
        items.map((item) => (
          <ItemCard 
            key={item.id} 
            item={item} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))
      )}
    </div>
  );
};
