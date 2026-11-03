MATCHDAY — GITHUB PAGES STATIC VERSION

This version is intended for GitHub Pages (static hosting), not Flask.

FILES TO COMMIT TO THE ROOT OF THE EXISTING REPOSITORY:
  index.html
  styles.css
  app.js

KEEP THESE EXISTING MEDIA FILES IN THE REPOSITORY ROOT:
  bayern logo.png
  ajax logo.png
  Bayern video.mp4
  Ajax video.mp4

The JavaScript references those exact filenames. Spaces are URL-encoded in the paths.
The background video is fixed behind the whole page, muted, subtly visible, and alternates
Bayern then Ajax repeatedly. Logos load directly from the repository root.

PUBLISH:
1. In VS Code, open the repository folder.
2. Replace index.html, styles.css, and app.js with the files from this package.
3. Do NOT delete or move the four media files.
4. Commit and push the changes to the main branch.
5. In GitHub: Settings > Pages > Deploy from a branch > main > /(root), then Save.
6. Wait for the Pages deployment and open the published Pages URL.

IMPORTANT:
GitHub Pages cannot run server.py, SQLite, payment credentials, or secure payment callbacks.
This static version only provides a booking preview and explicitly does not take payment
or issue tickets. Real payments and ticket issuance require a separate HTTPS backend.
The fixture and event authorization must be confirmed by the organizer before sales.
