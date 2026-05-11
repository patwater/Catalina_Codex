# Catalina Codex ⚓

A private microsite for the annual Catalina Island camping trip. Birthdays, crew quotes, and a photo reel — all in one place.

**Live site:** deployed via Cloudflare Pages · password protected

---

## For Campers: How to Contribute

### Add a Birthday
Open the [Birthday Sheet](https://docs.google.com/spreadsheets/d/1tCzlHN3dYyesQmR7IW8WGAIfa5jXlRS-YUIYjPknek8) and add a row with your name, birthday date (YYYY-MM-DD), and an optional emoji. The site updates automatically.

### Add a Survey Response / Quote
Fill out the annual survey form. Your responses will show up in the rotating Wall of Quotes on the site.

### Add Photos
Drop photos into the `public/photos/` folder in this repo and open a pull request. Keep filenames simple (no spaces if possible). They'll appear in the Photo Reel automatically after the PR is merged.

---

## For Developers

### Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Data:** Google Sheets (published CSV) → Cloudflare Worker → frontend
- **Hosting:** Cloudflare Pages
- **Worker:** `worker/index.js` — proxies sheet data as JSON

### Local dev
```bash
npm install
npm run dev        # http://localhost:5173
# password: fox
```

### Environment variables
| Variable | Where | Purpose |
|---|---|---|
| `VITE_WORKER_URL` | Cloudflare Pages env | URL of deployed Worker |
| `PHOTOS_CSV_URL` | Cloudflare Worker secret | Optional photos sheet CSV URL |

### Deploy
Push to `main` → GitHub Action builds and deploys to Cloudflare Pages automatically.

The Cloudflare Worker is deployed separately:
```bash
cd worker
wrangler deploy
```

### Adding a new section
1. Create a component in `src/components/`
2. Add mock data to `src/data/data.json`
3. Import and render it in `src/App.jsx`
4. If it needs live data, add a route to `worker/index.js`
