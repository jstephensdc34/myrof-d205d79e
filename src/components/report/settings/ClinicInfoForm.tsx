
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updateSetting, ReportSetting } from "@/services/reportSettingsService";
import { Loader2 } from "lucide-react";
import { LogoUpload } from "./LogoUpload";

interface ClinicInfoFormProps {
  settings: ReportSetting[];
  onSettingUpdated: (updatedSetting: ReportSetting) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const ClinicInfoForm = ({ 
  settings, 
  onSettingUpdated,
  isAuthenticated,
  loading
}: ClinicInfoFormProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [clinicInfo, setClinicInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logoUrl: ""
  });

  // Initialize form with existing settings
  useEffect(() => {
    if (settings.length > 0) {
      setClinicInfo({
        name: settings.find(s => s.name === "clinic_name")?.value || "",
        address: settings.find(s => s.name === "clinic_address")?.value || "",
        phone: settings.find(s => s.name === "clinic_phone")?.value || "",
        email: settings.find(s => s.name === "clinic_email")?.value || "",
        website: settings.find(s => s.name === "clinic_website")?.value || "",
        logoUrl: settings.find(s => s.name === "logo_url")?.value || ""
      });
    }
  }, [settings]);

  const handleInputChange = (field: keyof typeof clinicInfo, value: string) => {
    setClinicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to update clinic information",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update each setting one by one
      const updatePromises = [
        updateSettingAndNotify("clinic_name", clinicInfo.name),
        updateSettingAndNotify("clinic_address", clinicInfo.address),
        updateSettingAndNotify("clinic_phone", clinicInfo.phone),
        updateSettingAndNotify("clinic_email", clinicInfo.email),
        updateSettingAndNotify("clinic_website", clinicInfo.website)
      ];

      await Promise.all(updatePromises);

      toast({
        title: "Success",
        description: "Clinic information updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update clinic information",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettingAndNotify = async (name: string, value: string) => {
    const updatedSetting = await updateSetting(name, value);
    onSettingUpdated(updatedSetting);
    return updatedSetting;
  };

  const handleLogoUploaded = (url: string) => {
    setClinicInfo(prev => ({ ...prev, logoUrl: url }));
    
    // Find the setting to update in the local state
    const logoSetting = settings.find(s => s.name === "logo_url");
    if (logoSetting) {
      // Create updated setting object
      const updatedSetting = {
        ...logoSetting,
        value: url
      };
      // Notify parent component
      onSettingUpdated(updatedSetting);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Clinic Logo</h3>
        <LogoUpload 
          currentLogoUrl={clinicInfo.logoUrl}
          onLogoUploaded={handleLogoUploaded}
          isAuthenticated={isAuthenticated}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Clinic Information</h3>
        
        <div className="grid gap-4">
          <div>
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              value={clinicInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading || !isAuthenticated}
            />
          </div>
          
          <div>
            <Label htmlFor="clinicAddress">Address</Label>
            <Input
              id="clinicAddress"
              value={clinicInfo.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={loading || !isAuthenticated}
            />
          </div>
          
          <div>
            <Label htmlFor="clinicPhone">Phone</Label>
            <Input
              id="clinicPhone"
              value={clinicInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={loading || !isAuthenticated}
            />
          </div>
          
          <div>
            <Label htmlFor="clinicEmail">Email</Label>
            <Input
              id="clinicEmail"
              type="email"
              value={clinicInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={loading || !isAuthenticated}
            />
          </div>
          
          <div>
            <Label htmlFor="clinicWebsite">Website</Label>
            <Input
              id="clinicWebsite"
              value={clinicInfo.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              disabled={loading || !isAuthenticated}
            />
          </div>
        </div>
        
        <Button
          onClick={handleSave}
          disabled={isSaving || loading || !isAuthenticated}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Clinic Information"
          )}
        </Button>
      </div>
    </div>
  );
};
