# Make published connection settings reliable

## Change
- Update the build configuration to map Lovable Cloud's hosting connection names to the browser-safe app names during production builds.
- Keep the existing preview and buyer-deployment setting names working unchanged.
- Do not alter authentication, stored data, or database access rules.

## Verification
- Confirm the generated website package contains the correct backend address.
- Open the preview and verify its database request succeeds.
- Republish and open the public URL to confirm the app loads instead of showing “Connection setup required.”
