
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AuthForm } from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/report");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const toggleMode = () => {
    setMode(prev => prev === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-16 px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-medical-700">
              {mode === "login" ? "Login to Your Account" : "Create a New Account"}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === "login" 
                ? "Enter your credentials to access your reports" 
                : "Sign up to start creating chiropractic reports"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode={mode} toggleMode={toggleMode} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
