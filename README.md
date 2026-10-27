# Jaga Sri — Editable Portfolio Website

A responsive, elegant-light portfolio built with plain HTML, CSS, and JavaScript. No build tools or package installation are required.

## Included
- Responsive desktop, tablet, and mobile layout
- About, skills, projects, education, resume, and contact sections
- Browser-based edit mode for text, project links, social links, skill groups, and resume URL
- Save changes to browser `localStorage`
- Export your editable profile data to a JSON backup
- Decorative project previews built with HTML/CSS (no image assets required)
- Basic accessibility features and print-friendly CSS

## Run locally
1. Extract the ZIP file.
2. Open `index.html` in a modern browser.

For a local development server (optional), open a terminal in this folder and run one of:
- Python: `python -m http.server 8000`
- Node.js (if you already have it): `npx serve .`

Then open `http://localhost:8000` or the URL printed by your server.

## Edit the portfolio
1. Open the site and select **Edit portfolio** in the top navigation.
2. Click any highlighted text to edit it directly.
3. Click a skill/tag group to replace the comma-separated items.
4. Click a project arrow, GitHub, LinkedIn, email link, or the resume button to enter your real URL.
5. Select **Save changes**. Changes persist in that browser on that device.
6. Use **Export profile JSON** to keep a backup of your content.

### Important
- Browser-saved changes are stored locally. They do not automatically transfer to another browser/device and are not included in the source files.
- The JSON export is a backup of your content. It is not a deployable website by itself.
- For a permanent public portfolio, update `index.html`/`styles.css`/`script.js` in your editor and deploy the folder to GitHub Pages, Netlify, or another static host.
- The website is client-side only. It does not include a server, contact form backend, login system, or cloud database.
- Add only verified facts. Replace the placeholder college name, contact links, resume URL, and project repository links before sharing publicly.
- The default name is Jaga Sri based on the portfolio context. Change it in edit mode if you prefer a different display name.

## Project structure
```
portfolio_website/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Recommended before publishing
- Add your college/university name and exact education dates.
- Add your resume PDF to Google Drive and set sharing to “Anyone with the link can view”, then paste the URL into the resume link.
- Add public GitHub repository URLs for each project.
- Add your LinkedIn URL and professional email.
- Check the website on mobile and ensure the repository contains no credentials, tokens, or private data.
