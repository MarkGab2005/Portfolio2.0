Simple Portfolio
================

This is a minimal, static portfolio template.

Files
- `index.html`: Main page with sections (hero, about, projects, contact).
- `styles.css`: Simple responsive styles.
- `script.js`: Small interactions (smooth scroll and set year).
 - `data/projects.json`: optional sample data you can load from the page.

Open locally
- Windows PowerShell (open directly):

```powershell
Start-Process "index.html"
```

- Or serve with Python (works cross-platform):

```powershell
# from inside the portfolio folder
python -m http.server 8000; Start-Process "http://localhost:8000"
```

Next steps / customization ideas
- Replace placeholder texts and project links with real content.
- Add images to an `assets/` folder and reference them in project cards.
- Expand with contact form backend or link to social profiles.

Importing your data
- You can import a JSON or CSV file directly from the page. Click "Import JSON / CSV" or drag & drop a file into the projects area.
- Supported shapes:
	- JSON array of project objects: `[ { "title": "...", "description": "...", "link": "..." } ]`
	- JSON object with a `projects` array: `{ "projects": [ ... ] }`
	- CSV: first row should contain headers like `title,description,link` and following rows the values.

Notes
- Importing a local `data/projects.json` requires serving the folder with a local server (e.g. `python -m http.server`) due to browser fetch restrictions when opening `index.html` as a file.
- If you want image thumbnails, put them into an `assets/` folder and include an `image` field in your data with the relative path, e.g. `assets/thumb.png`.

Assets added
- I added an `assets/` folder with three SVG placeholder thumbnails: `assets/thumb1.svg`, `assets/thumb2.svg`, and `assets/thumb3.svg`.
- The sample `data/projects.json` was updated to reference these images. If you import your own JSON/CSV, include an `image` field with the relative path to use thumbnails.

If you want, I can:
- Add a small image assets folder and placeholder images.
- Convert this to a single-page React app or add a theme toggle.
- Deploy it to GitHub Pages and give you deployment steps.
