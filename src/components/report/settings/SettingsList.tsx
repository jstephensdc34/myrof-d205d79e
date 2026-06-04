
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { ReportSetting, updateSetting, deleteSetting } from "@/services/reportSettingsService";

interface SettingsListProps {
  settings: ReportSetting[];
  loading: boolean;
  isAuthenticated: boolean;
  onSettingUpdated: (updatedSetting: ReportSetting) => void;
  onSettingDeleted: (id: string) => void;
}

export const SettingsList = ({ 
  settings, 
  loading, 
  isAuthenticated,
  onSettingUpdated,
  onSettingDeleted
}: SettingsListProps) => {
  const { toast } = useToast();
  const [editSettingId, setEditSettingId] = useState<string | null>(null);
  const [editSettingValue, setEditSettingValue] = useState("");

  const startEditSetting = (setting: ReportSetting) => {
    setEditSettingId(setting.id);
    setEditSettingValue(setting.value || "");
  };

  const cancelEditSetting = () => {
    setEditSettingId(null);
    setEditSettingValue("");
  };

  const handleUpdateSetting = async (id: string) => {
    try {
      const updatedSetting = await updateSetting(id, editSettingValue);
      
      onSettingUpdated(updatedSetting);
      setEditSettingId(null);
      
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update setting",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSetting = async (id: string) => {
    try {
      await deleteSetting(id);
      
      onSettingDeleted(id);
      
      toast({
        title: "Success",
        description: "Setting deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete setting",
        variant: "destructive"
      });
    }
  };

  if (loading && settings.length === 0) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  if (settings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No settings found. Create some settings to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {settings.map((setting) => (
          <TableRow key={setting.id}>
            <TableCell className="font-medium">{setting.name}</TableCell>
            <TableCell>
              {editSettingId === setting.id ? (
                <div className="flex space-x-2">
                  <Input
                    value={editSettingValue}
                    onChange={(e) => setEditSettingValue(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleUpdateSetting(setting.id)}
                    disabled={loading || !isAuthenticated}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEditSetting}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                setting.value
              )}
            </TableCell>
            <TableCell className="text-right">
              {editSettingId !== setting.id && (
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditSetting(setting)}
                    disabled={!isAuthenticated}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={!isAuthenticated}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will permanently delete the setting "{setting.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteSetting(setting.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
