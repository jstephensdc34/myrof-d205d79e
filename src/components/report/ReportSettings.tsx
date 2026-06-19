
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ReportSetting } from "@/services/reportSettingsService";
import { ConnectionStatus } from "./settings/ConnectionStatus";
import { useSupabaseConnection } from "@/hooks/useSupabaseConnection";
import { useReportSettings } from "@/hooks/useReportSettings";
import { ClinicInfoForm } from "./settings/ClinicInfoForm";

interface ReportSettingsProps {
  onSettingsUpdated?: () => void;
}

export const ReportSettings = ({ onSettingsUpdated }: ReportSettingsProps) => {
  const { isAuthenticated, connectionStatus } = useSupabaseConnection();
  const { settings, loading, error, setSettings, reloadSettings } = useReportSettings(connectionStatus);

  const handleSettingUpdated = (updatedSetting: ReportSetting) => {
    setSettings(prev => prev.map(s => s.id === updatedSetting.id ? updatedSetting : s));
    if (onSettingsUpdated) onSettingsUpdated();
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Clinic Information</span>
          <ConnectionStatus 
            connectionStatus={connectionStatus} 
            isAuthenticated={isAuthenticated}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <ClinicInfoForm
            settings={settings}
            onSettingUpdated={handleSettingUpdated}
            isAuthenticated={isAuthenticated}
            loading={loading}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {isAuthenticated 
            ? "Changes are saved to your clinic profile"
            : "Log in to manage clinic information"}
        </div>
      </CardFooter>
    </Card>
  );
};
