import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const isValidFileName = (value: string) => Boolean(value) && !value.includes("/") && !value.includes("..");

const SharedReport = () => {
  const [searchParams] = useSearchParams();
  const [html, setHtml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fileName = searchParams.get("file") ?? "";

  const storageUrl = useMemo(() => {
    if (!fileName) return "";
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/shared-reports/${encodeURIComponent(fileName)}`;
  }, [fileName]);

  useEffect(() => {
    if (!isValidFileName(fileName)) {
      setError("This report link is invalid.");
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const loadReport = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(storageUrl);

        if (!response.ok) {
          throw new Error(response.status === 404 ? "This report could not be found." : "Unable to load this report.");
        }

        const reportHtml = await response.text();

        if (!reportHtml.trim()) {
          throw new Error("This report is empty.");
        }

        if (!isCancelled) {
          setHtml(reportHtml);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Unable to load this report.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadReport();

    return () => {
      isCancelled = true;
    };
  }, [fileName, storageUrl]);

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Shared patient report</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Patient Report</h1>
          </div>

          {storageUrl && !isLoading && !error ? (
            <Button asChild variant="outline">
              <a href={storageUrl} target="_blank" rel="noreferrer">
                Open source file
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex min-h-[240px] items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading report…</span>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Report unavailable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <iframe
              title="Shared patient report"
              className="h-[calc(100vh-7rem)] min-h-[720px] w-full bg-background"
              sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
              srcDoc={html}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default SharedReport;