
import { createRoot } from 'react-dom/client'
import { StrictMode, Suspense } from 'react'
import './index.css'

// Create a more robust error handling setup
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Failed to find the root element</div>';
} else {
  const root = createRoot(rootElement);
  
  // Handle potential runtime errors during initialization
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    // Display error in the DOM for visibility even if console isn't open
    const errorDiv = document.createElement('div');
    errorDiv.style.padding = '20px';
    errorDiv.style.color = 'red';
    errorDiv.style.backgroundColor = '#ffeeee';
    errorDiv.style.border = '1px solid red';
    errorDiv.style.margin = '20px';
    errorDiv.innerHTML = `<h3>Error Loading Application</h3>
                          <p>${event.error?.message || 'Unknown error'}</p>
                          <pre style="overflow: auto; max-height: 300px;">${event.error?.stack || ''}</pre>`;
    document.body.insertBefore(errorDiv, document.body.firstChild);
  });

  // Log app start and environment info
  console.log("Starting application");
  console.log("Base URL:", import.meta.env.BASE_URL);
  console.log("Environment:", import.meta.env.MODE);
  
  import('./App.tsx')
      .then(({ default: App }) => {
        root.render(
          <StrictMode>
            <Suspense fallback={<div>Loading application...</div>}>
              <App />
            </Suspense>
          </StrictMode>
        );
        console.log("App rendering started");
      })
      .catch((error: unknown) => {
        console.error("Error rendering the application:", error);
        root.render(
          <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="w-full max-w-lg rounded-lg border border-destructive bg-card p-6 text-card-foreground shadow-sm">
              <h1 className="mb-2 text-xl font-semibold">Error loading application</h1>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : String(error)}
              </p>
            </div>
          </div>
        );
      });
}
