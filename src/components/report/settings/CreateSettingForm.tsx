
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createSetting } from "@/services/reportSettingsService";
import { ReportSetting } from "@/services/reportSettingsService";

interface CreateSettingFormProps {
  isAuthenticated: boolean;
  loading: boolean;
  onSettingCreated: (setting: ReportSetting) => void;
  setActiveTab: (tab: string) => void;
}

export const CreateSettingForm = ({ 
  isAuthenticated, 
  loading, 
  onSettingCreated, 
  setActiveTab 
}: CreateSettingFormProps) => {
  const { toast } = useToast();
  const [newSettingName, setNewSettingName] = useState("");
  const [newSettingValue, setNewSettingValue] = useState("");

  const handleCreateSetting = async () => {
    if (!newSettingName.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please provide a setting name",
        variant: "destructive"
      });
      return;
    }

    try {
      const newSetting = await createSetting(newSettingName, newSettingValue);
      
      onSettingCreated(newSetting);
      
      setNewSettingName("");
      setNewSettingValue("");
      setActiveTab("view");
      
      toast({
        title: "Success",
        description: "Setting created successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create setting",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="settingName" className="block text-sm font-medium mb-1">
          Setting Name
        </label>
        <Input
          id="settingName"
          value={newSettingName}
          onChange={(e) => setNewSettingName(e.target.value)}
          placeholder="Enter setting name"
          disabled={loading || !isAuthenticated}
        />
      </div>
      <div>
        <label htmlFor="settingValue" className="block text-sm font-medium mb-1">
          Setting Value
        </label>
        <Input
          id="settingValue"
          value={newSettingValue}
          onChange={(e) => setNewSettingValue(e.target.value)}
          placeholder="Enter setting value"
          disabled={loading || !isAuthenticated}
        />
      </div>
      <Button
        onClick={handleCreateSetting}
        disabled={loading || !newSettingName.trim() || !isAuthenticated}
      >
        Create Setting
      </Button>
    </div>
  );
};
