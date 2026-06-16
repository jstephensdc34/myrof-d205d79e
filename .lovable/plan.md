## Goal

Commit the already-validated `public/library-seed.csv` (150 rows) to GitHub so the connected Vercel deployment auto-builds with it. The Lovable preview does **not** need to be published, and no Supabase keys need to be added to this Lovable project.

## Why this works

- The **Load Starter Library** button fetches `/library-seed.csv` from the same host that serves the app, then inserts into the Supabase project configured by that host's environment variables.
- Your Vercel project is wired to the buyer's Supabase keys. Once the CSV is in the repo's `public/` folder, Vercel rebuilds and the button on the Vercel URL imports into the correct database.

## Steps

1. Commit/push `public/library-seed.csv` to the GitHub repo via Lovable's GitHub sync.
2. Vercel auto-deploys from the push (usually ~1 minute).
3. On the Vercel deployment, sign in, open the Library page, click **Load Starter Library**, and confirm 150 items appear.

## Buyer pre-conditions (confirmed)

- `BUYER_SETUP.md` Step 2 already requires running `setup.sql`, so `library_categories` and `library_subcategories` exist before the button is clicked.
- The CSV validation we ran earlier passed: every `category_id` / `subcategory_id` matches the schema.

## Outcome

Buyers who deploy from the public repo get the starter library bundled with their deployment and can import it with one button click.