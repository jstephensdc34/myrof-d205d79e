import { Navbar } from "@/components/layout/Navbar";
import { ReportSettings } from "@/components/report/ReportSettings";

const Settings = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold text-medical-700">Settings</h1>
      <ReportSettings />
    </div>
  </div>
);

export default Settings;
