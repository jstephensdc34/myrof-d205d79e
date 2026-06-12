export const SetupRequired = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-lg w-full border border-border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
        <h1 className="text-xl font-semibold mb-2">Database setup required</h1>
        <p className="text-sm text-muted-foreground mb-4">
          The app connected to Supabase, but the database tables haven't been
          created yet. Run the one-time setup script before signing in.
        </p>
        <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1 mb-4">
          <li>Open your Supabase project → <strong>SQL Editor</strong>.</li>
          <li>
            Paste the entire contents of <code>setup.sql</code> from your
            repository.
          </li>
          <li>
            Click <strong>Run</strong> and wait for <code>Setup complete</code>.
          </li>
          <li>Reload this page.</li>
        </ol>
        <p className="text-xs text-muted-foreground">
          See <strong>BUYER_SETUP.md</strong> Step 2 for the full walkthrough.
        </p>
        {errorMessage && (
          <pre className="text-[10px] bg-muted p-2 rounded mt-4 overflow-x-auto">
            {errorMessage}
          </pre>
        )}
      </div>
    </div>
  );
};