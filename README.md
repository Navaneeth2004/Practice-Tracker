# Practice Log

A single-page web app for tracking piano practice. Runs in the browser with no account, server or build step.

Open `index.html` (or host the folder, for example on GitHub Pages). For YouTube playback inside the app, use a local server (`python -m http.server 8000`) or GitHub Pages, because YouTube blocks playback on pages opened as files.

## Screens
Today, Review (recordings by folder, video beside notes), Pieces (folders, tempo), Resources, Calendar (month, day tabs, routines), Tags, Search, Progress, Backup (cloud sync, export, import with undo).

## Structure
- `css/` base, layout, components, calendar, then ui (shared kit), review, pieces, resources, schedule, dash
- `js/` store, state, utils, modal, kit (side panel and toast), logic/, views/ (one file per screen), actions/ (what buttons do), main
- `sync-script-v2.gs` the Google Apps Script for optional cloud sync

Scripts are plain files, so load order in `index.html` matters.

## Your data
Stored in your browser's local storage, per device and web address. Export a backup from the Backup tab now and then.
