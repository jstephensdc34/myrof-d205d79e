import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileArchive } from "lucide-react";

const SOURCE_ZIP_URL = "/chiropractic-patient-report-generator-source.zip";

export default function SourceDownload() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FileArchive className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Download Source Code</CardTitle>
          <CardDescription>
            Use this bundle to update the public GitHub repository that powers
            the Vercel one-click deploy link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This ZIP contains the full application source (excluding secrets,
            node_modules, and build artifacts). Extract it into your product
            folder, commit the changes to your public repo, and Vercel will
            pick up the new deployment automatically.
          </p>
          <Button asChild size="lg" className="w-full">
            <a href={SOURCE_ZIP_URL} download>
              <Download className="mr-2 h-4 w-4" />
              Download source-code.zip
            </a>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            File: <code>chiropractic-patient-report-generator-source.zip</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
