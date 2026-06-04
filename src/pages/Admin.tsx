
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { CopyLibraryItems } from "@/components/admin/CopyLibraryItems";
import { useAuth } from "@/components/auth/AuthContext";

const Admin = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid gap-6">
          <CopyLibraryItems />
          {/* Add more admin tools here as needed */}
        </div>
      </div>
    </div>
  );
};

export default Admin;
