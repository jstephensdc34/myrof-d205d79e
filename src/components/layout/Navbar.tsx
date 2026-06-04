
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-xl font-semibold text-medical-700">Chiro Patient Ed Suite</span>
        </Link>
        <div className="flex items-center lg:order-2">
          <div className="flex space-x-2">
            {isAuthenticated ? (
              <>
                <Link to="/report">
                  <Button variant="default" className="bg-medical-600 hover:bg-medical-700">
                    Create Report
                  </Button>
                </Link>
                <Link to="/library">
                  <Button variant="outline" className="text-medical-600 border-medical-600 hover:bg-medical-100">
                    Manage Library
                  </Button>
                </Link>
                <Button variant="outline" onClick={signOut} className="border-red-500 text-red-500 hover:bg-red-50">
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="bg-medical-600 hover:bg-medical-700">
                  Login / Sign Up
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
