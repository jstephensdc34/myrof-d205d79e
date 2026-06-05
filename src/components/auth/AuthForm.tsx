
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthFormProps {
  mode: "login" | "signup";
  toggleMode: () => void;
}

export const AuthForm = ({ mode, toggleMode }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Successfully logged in!");
        navigate("/report");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/report`,
          },
        });

        if (error) throw error;
        
        toast.success("Account created and logged in successfully!");
        navigate("/report");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-medical-600 hover:bg-medical-700"
        disabled={loading}
      >
        {loading ? "Processing..." : mode === "login" ? "Login" : "Sign Up"}
      </Button>
      
      <div className="text-center text-sm">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}
        <Button 
          variant="link" 
          className="ml-1 text-medical-600"
          onClick={toggleMode}
          type="button"
        >
          {mode === "login" ? "Sign up" : "Login"}
        </Button>
      </div>
    </form>
  );
};
