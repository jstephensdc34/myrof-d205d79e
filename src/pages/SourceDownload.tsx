import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileArchive } from "lucide-react";

const SOURCE_ZIP_URL = "/chiropractic-patient-report-generator-source.zip";
const WELCOME_KIT_URL = "/chiropractic-patient-report-generator-welcome-kit.zip";

export default function SourceDownload() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FileArchive className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Download Product Files</CardTitle>
          <CardDescription>
            Updated bundles for Chiropractic Patient Report Generator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use the source bundle to update the public GitHub repository that
            powers the Vercel one-click deploy link. Use the Welcome Kit when
            sending setup assets to a buyer.
          </p>

          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <a href={SOURCE_ZIP_URL} download>
                <Download className="mr-2 h-4 w-4" />
                Download source-code.zip
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full">
              <a href={WELCOME_KIT_URL} download>
                <Download className="mr-2 h-4 w-4" />
                Download buyer Welcome Kit (.zip)
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Files: <code>chiropractic-patient-report-generator-source.zip</code>
            {" "}and{" "}
            <code>chiropractic-patient-report-generator-welcome-kit.zip</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
