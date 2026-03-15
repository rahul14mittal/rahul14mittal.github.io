# Indian Wedding Website for GitHub Pages

This is a static website that shows a multi-day Indian wedding timeline with:

- Day-based filtering
- Side-based filtering (Groom Side, Bride Side, Both Families)
- Popup ritual descriptions for each event
- Mobile-friendly responsive layout
- JSON-based content files for easy editing

## Customize Your Wedding Details

Edit these JSON files:

- `data/couple.json`
   - Couple names
   - Wedding type text/subtitle
   - SEO title and description
- `data/schedule.json`
   - Add/remove full days in the `days` array
   - Add/remove events inside each day's `events` array
   - Update time, side (`groom`, `bride`, `both`), location, and ritual descriptions

## Run Locally

Because data is loaded using `fetch`, run a small local web server instead of opening the file directly:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### One-Click Local Preview (macOS)

You can also double-click `Start Local Preview.command` in Finder.

- It starts the server from the project folder
- Opens `http://localhost:8000`
- Keeps running until you press `Ctrl+C`

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to the repository on GitHub.
3. Open **Settings > Pages**.
4. Under **Build and deployment**, choose:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch), folder `/ (root)`
5. Save and wait for deployment.
6. Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

If this repository is named `<your-username>.github.io`, then your site URL is:

`https://<your-username>.github.io/`
