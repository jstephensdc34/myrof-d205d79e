
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ConnectionStatusProps {
  connectionStatus: "checking" | "connected" | "disconnected";
  isAuthenticated: boolean;
}

export const ConnectionStatus = ({ connectionStatus, isAuthenticated }: ConnectionStatusProps) => {
  const { user } = useAuth();
  
  return (
    <>
      <div className="text-sm font-normal">
        {connectionStatus === "checking" && "Checking database connection..."}
        {connectionStatus === "connected" && (
          <span className="text-green-600 flex items-center">
            <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
            Connected to database
          </span>
        )}
        {connectionStatus === "disconnected" && (
          <span className="text-red-600 flex items-center">
            <span className="h-2 w-2 bg-red-600 rounded-full mr-2"></span>
            Database disconnected
          </span>
        )}
      </div>
      {!isAuthenticated && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-yellow-700 mb-2 md:mb-0">
              You are not authenticated. You can view settings, but you won't be able to create, update, or delete them.
            </p>
            <Link to="/auth">
              <Button className="bg-medical-600 hover:bg-medical-700 whitespace-nowrap">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
