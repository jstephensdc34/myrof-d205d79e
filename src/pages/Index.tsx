
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/components/auth/AuthContext";
import { useSupabaseConnection } from "@/hooks/useSupabaseConnection";
import { useReportSettings } from "@/hooks/useReportSettings";
import { AlertCircle } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { connectionStatus } = useSupabaseConnection();
  const { settings, loading } = useReportSettings(connectionStatus);
  const clinicName = settings.find((s) => s.name === "clinic_name")?.value?.trim() ?? "";
  const showWelcomeNudge = isAuthenticated && !loading && clinicName === "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          {showWelcomeNudge && (
            <div className="w-full max-w-6xl rounded-lg border border-amber-300 bg-amber-50 p-4 text-left flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900">Welcome — finish setting up your clinic</h3>
                <p className="text-sm text-amber-800 mt-1">
                  Add your clinic name, contact info, and logo so they appear on every report and PDF you generate.
                </p>
                <Link to="/report" className="inline-block mt-2">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Add clinic information
                  </Button>
                </Link>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-medical-800 sm:text-5xl">
              MyROF Report
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive patient education tool to create patient report and deliver patient education materials.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto">
            <Card className="border-2 hover:border-medical-400 transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-medical-700">Create New Report</CardTitle>
                <CardDescription>Generate comprehensive patient treatment plans and reports</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Link to="/report" className="w-full">
                  <Button className="w-full bg-medical-600 hover:bg-medical-700">Create Report</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-medical-400 transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-medical-700">Manage Library</CardTitle>
                <CardDescription>Add and edit your collection of diagnoses, treatments and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Link to="/library" className="w-full">
                  <Button variant="outline" className="w-full text-medical-600 border-medical-600 hover:bg-medical-100">
                    Manage Library
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-6xl">
            <h2 className="text-2xl font-semibold text-medical-700 mb-4">About MyROF Report</h2>
            <div className="text-left space-y-4">
              <p>
                MyROF Report helps clinicians generate three structured patient reports — Diagnosis, Treatment Plan,
                and Home Care — from a customizable clinical library. Deliver finished reports to patients as
                shareable HTML links or polished PDF downloads, so education materials reach them in the format
                that works best.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-medical-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-medical-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-md font-medium text-gray-800">Diagnosis Report</h3>
                    <p className="text-sm text-gray-600">Structured findings and assessment documentation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-medical-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-medical-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-md font-medium text-gray-800">Treatment Plan</h3>
                    <p className="text-sm text-gray-600">Personalized care plans with goals and modalities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-medical-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-medical-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-md font-medium text-gray-800">Home Care Report</h3>
                    <p className="text-sm text-gray-600">Patient take-home instructions and recommendations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-medical-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-medical-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-md font-medium text-gray-800">Shareable HTML + PDF Export</h3>
                    <p className="text-sm text-gray-600">Deliver reports via link or download as PDF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-white py-6 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">© 2026 MyROF Report. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
