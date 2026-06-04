
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportSetting } from "@/services/reportSettingsService";
import { ConnectionStatus } from "./settings/ConnectionStatus";
import { CreateSettingForm } from "./settings/CreateSettingForm";
import { SettingsList } from "./settings/SettingsList";
import { useSupabaseConnection } from "@/hooks/useSupabaseConnection";
import { useReportSettings } from "@/hooks/useReportSettings";
import { ClinicInfoForm } from "./settings/ClinicInfoForm";

interface ReportSettingsProps {
  onSettingsUpdated?: () => void;
}

export const ReportSettings = ({ onSettingsUpdated }: ReportSettingsProps) => {
  const { isAuthenticated, connectionStatus } = useSupabaseConnection();
  const { settings, loading, error, setSettings, reloadSettings } = useReportSettings(connectionStatus);
  const [activeTab, setActiveTab] = useState("view");

  const handleSettingCreated = (newSetting: ReportSetting) => {
    setSettings(prev => [...prev, newSetting]);
    if (onSettingsUpdated) onSettingsUpdated();
  };

  const handleSettingUpdated = (updatedSetting: ReportSetting) => {
    setSettings(prev => prev.map(s => s.id === updatedSetting.id ? updatedSetting : s));
    if (onSettingsUpdated) onSettingsUpdated();
  };

  const handleSettingDeleted = (id: string) => {
    setSettings(prev => prev.filter(s => s.id !== id));
    if (onSettingsUpdated) onSettingsUpdated();
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Report Settings</span>
          <ConnectionStatus 
            connectionStatus={connectionStatus} 
            isAuthenticated={isAuthenticated}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="view" className="flex-1">View Settings</TabsTrigger>
            <TabsTrigger value="clinic" className="flex-1">Clinic Information</TabsTrigger>
            <TabsTrigger value="create" className="flex-1">Create Setting</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : (
              <SettingsList 
                settings={settings}
                loading={loading}
                isAuthenticated={isAuthenticated}
                onSettingUpdated={handleSettingUpdated}
                onSettingDeleted={handleSettingDeleted}
              />
            )}
          </TabsContent>
          
          <TabsContent value="clinic">
            <ClinicInfoForm
              settings={settings}
              onSettingUpdated={handleSettingUpdated}
              isAuthenticated={isAuthenticated}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="create">
            <CreateSettingForm 
              isAuthenticated={isAuthenticated}
              loading={loading}
              onSettingCreated={handleSettingCreated}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {isAuthenticated 
            ? "You can create, update, and delete settings"
            : "Log in to manage settings"}
        </div>
      </CardFooter>
    </Card>
  );
};
