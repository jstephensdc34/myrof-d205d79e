
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ReportSetting } from "@/services/reportSettingsService";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportHeaderProps {
  settings?: ReportSetting[];
  loading?: boolean;
}

export const ReportHeader = ({ settings = [], loading = false }: ReportHeaderProps) => {
  const [clinicInfo, setClinicInfo] = useState({
    name: "My Chiropractic Clinic",
    address: "123 Health Street, Medical City, CA 90210",
    phone: "(555) 123-4567",
    email: "contact@mychiropractic.com",
    website: "www.mychiropractic.com",
    logoUrl: ""
  });

  useEffect(() => {
    if (settings.length > 0) {
      const info = {
        name: settings.find(s => s.name === "clinic_name")?.value || clinicInfo.name,
        address: settings.find(s => s.name === "clinic_address")?.value || clinicInfo.address,
        phone: settings.find(s => s.name === "clinic_phone")?.value || clinicInfo.phone,
        email: settings.find(s => s.name === "clinic_email")?.value || clinicInfo.email,
        website: settings.find(s => s.name === "clinic_website")?.value || clinicInfo.website,
        logoUrl: settings.find(s => s.name === "logo_url")?.value || clinicInfo.logoUrl
      };
      setClinicInfo(info);
    }
  }, [settings]);

  if (loading) {
    return (
      <Card className="mb-6 bg-gray-50 border border-gray-200">
        <CardContent className="pt-4 flex items-center gap-6">
          <Skeleton className="w-28 h-28" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-gray-50 border border-gray-200">
      <CardContent className="pt-4 flex items-center gap-6">
        <div className="flex-shrink-0 h-28 w-auto max-w-[14rem] flex items-center justify-center">
          {clinicInfo.logoUrl ? (
            <img
              src={clinicInfo.logoUrl}
              alt="Clinic Logo"
              className="h-28 max-h-28 w-auto max-w-[14rem] object-contain"
            />
          ) : (
            <div className="h-28 w-28 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-xs text-gray-500">Logo</span>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-medical-700">{clinicInfo.name}</h2>
          <div className="text-sm text-gray-600">
            <p>{clinicInfo.address}</p>
            <p className="flex flex-wrap gap-x-4">
              <span>{clinicInfo.phone}</span>
              <span>{clinicInfo.email}</span>
              <span>{clinicInfo.website}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
