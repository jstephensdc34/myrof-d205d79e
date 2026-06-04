
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ReportItem } from "@/types";

interface FormFieldsProps {
  item: Partial<ReportItem>;
  handleChange: (field: keyof ReportItem, value: string) => void;
  isSubmitting: boolean;
  availableSubcategories: {
    id: string;
    name: string;
    parentCategoryId?: string;
    description?: string;
  }[];
}

export const FormFields = ({
  item,
  handleChange,
  isSubmitting,
  availableSubcategories
}: FormFieldsProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={item.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="definition">Definition</Label>
        <Input
          id="definition"
          placeholder="Brief 1-2 sentence definition..."
          value={item.definition || ""}
          onChange={(e) => handleChange("definition", e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      {availableSubcategories.length > 0 && (
        <div className="grid gap-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select
            value={item.subcategoryId}
            onValueChange={(value) => handleChange("subcategoryId", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {availableSubcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <RichTextEditor
          value={item.description || ""}
          onChange={(value) => handleChange("description", value)}
          disabled={isSubmitting}
          placeholder="Enter a detailed description..."
          key={`editor-${item.id || 'new'}`} // Add a key to force re-initialization when item changes
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="infoLink">Information Link (Optional)</Label>
        <Input
          id="infoLink"
          type="url"
          placeholder="https://example.com"
          value={item.infoLink || ""}
          onChange={(e) => handleChange("infoLink", e.target.value)}
          disabled={isSubmitting}
        />
      </div>
    </>
  );
};
