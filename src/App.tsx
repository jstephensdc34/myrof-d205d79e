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
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SharedReport from "./pages/SharedReport";

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

const App = () => {
  // Log the app initialization for debugging
  console.log("App initializing with base path:", getBasename());

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={getBasename()}>
          <ErrorBoundary>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/shared-report" element={<SharedReport />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<Admin />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
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
