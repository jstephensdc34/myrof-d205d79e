import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Report from "./pages/Report";
import Library from "./pages/Library";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SharedReport from "./pages/SharedReport";
import ResetPassword from "./pages/ResetPassword";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useDatabaseReady } from "@/hooks/useDatabaseReady";
import { SetupRequired } from "@/components/SetupRequired";

// Create a new QueryClient instance with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      // Updated to use meta.onError instead of onError directly
      meta: {
        onError: (error: unknown) => {
          console.error("Query error:", error);
        }
      }
    },
    mutations: {
      // Updated to use meta.onError instead of onError directly
      meta: {
        onError: (error: unknown) => {
          console.error("Mutation error:", error);
        }
      }
    }
  }
});

// Get the base URL from the environment or use root path
const getBasename = () => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return baseUrl === '/' ? '/' : baseUrl;
};

const DatabaseGuard = ({ children }: { children: React.ReactNode }) => {
  const { state, errorMessage } = useDatabaseReady();
  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }
  if (state === "not-ready") {
    return <SetupRequired errorMessage={errorMessage} />;
  }
  return <>{children}</>;
};

const App = () => {
  // Log the app initialization for debugging
  console.log("App initializing with base path:", getBasename());

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-lg w-full border border-border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
          <h1 className="text-xl font-semibold mb-2">Configuration required</h1>
          <p className="text-sm text-muted-foreground mb-4">
            This app needs two environment variables to connect to its backend:
          </p>
          <pre className="text-xs bg-muted p-3 rounded mb-4 overflow-x-auto">
VITE_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
          </pre>
          <p className="text-sm text-muted-foreground">
            Add them to a local <code>.env</code> file (for development) or to your
            hosting provider's environment variables (e.g. Vercel → Project Settings
            → Environment Variables), then redeploy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={getBasename()}>
          <ErrorBoundary>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <DatabaseGuard>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/report" element={<Report />} />
                    <Route path="/shared-report" element={<SharedReport />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </DatabaseGuard>
              </TooltipProvider>
            </AuthProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Add console logs for debugging purposes
console.log("App component defined");

export default App;
