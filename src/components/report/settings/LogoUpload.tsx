
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { updateSetting } from "@/services/reportSettingsService";
import { Loader2, Upload, X } from "lucide-react";

interface LogoUploadProps {
  currentLogoUrl: string | undefined;
  onLogoUploaded: (url: string) => void;
  isAuthenticated: boolean;
}

export const LogoUpload = ({ 
  currentLogoUrl, 
  onLogoUploaded,
  isAuthenticated
}: LogoUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('clinic-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(error.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('clinic-assets')
        .getPublicUrl(filePath);

      // Save URL to settings
      await updateSetting('logo_url', publicUrl);
      
      // Update UI
      onLogoUploaded(publicUrl);
      
      toast({
        title: "Logo uploaded",
        description: "Your clinic logo has been updated"
      });
    } catch (err) {
      console.error("Error uploading logo:", err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload logo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!currentLogoUrl) return;
    
    setIsUploading(true);
    try {
      // Extract file path from URL
      const urlParts = currentLogoUrl.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('clinic-assets') + 1).join('/');
      
      if (filePath) {
        // Remove file from storage
        await supabase.storage
          .from('clinic-assets')
          .remove([filePath]);
      }
      
      // Clear the setting
      await updateSetting('logo_url', '');
      
      // Update UI
      onLogoUploaded('');
      
      toast({
        title: "Logo removed",
        description: "Your clinic logo has been removed"
      });
    } catch (err) {
      console.error("Error removing logo:", err);
      toast({
        title: "Operation failed",
        description: err instanceof Error ? err.message : "Failed to remove logo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 border rounded flex items-center justify-center bg-gray-50">
          {currentLogoUrl ? (
            <img
              src={currentLogoUrl}
              alt="Clinic logo"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-gray-400 text-sm">No logo</span>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Input
            id="logoInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading || !isAuthenticated}
            className="max-w-xs"
          />
          
          <div className="flex space-x-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => document.getElementById('logoInput')?.click()}
              disabled={isUploading || !isAuthenticated}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </>
              )}
            </Button>
            
            {currentLogoUrl && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemoveLogo}
                disabled={isUploading || !isAuthenticated}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        Recommended size: 200x200px. Maximum size: 2MB.
      </p>
    </div>
  );
};
