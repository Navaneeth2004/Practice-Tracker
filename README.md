# Practice Log

A single-page web app for tracking piano practice. It runs entirely in your browser, with no account, server or build step. Works on phone and PC.

## Features

- **Today:** streak, today's plan, and a practice timer with start, pause, resume and stop. Only active time is logged, and the timer survives closing the page.
- **Focus next:** every open "needs work" note, newest first. Mark each one done on its own, step by step, from Today or from the recording.
- **Review:** add recordings (a YouTube or Drive link, or a local video file) that play inside the app, either small on the page or in a pop-up window and write timestamped notes with a type, section, technique tag and optional attached resource. Adding a note does not interrupt the video. Tap a timestamp to jump to that moment.
- **Tags:** create, rename and delete your own tags, and assign them to recordings, pieces and resources. Notes use them as technique tags.
- **Search:** one box that searches recordings, notes, pieces, resources, tags, dates and calendar items.
- **Pieces:** a library with a status for each piece, plus the weak spots tied to it.
- **Resources:** save links or text, tagged by technique, and attach them to notes.
- **Calendar:** a monthly view for planning and logging. Add items to any day, tick them off, and log minutes practiced.
- **Progress:** streaks, a 12-month practice heatmap, minutes this week, most-flagged techniques and a status history.
- **Cloud sync (optional):** paste one link on every device and they share one data file in your Google Drive. Without a link, data stays on the device.
- **Backup:** export a JSON backup or readable notes. Import with Replace or Merge to move data between devices.

Everything is editable, and the app uses a dark theme with no emojis.

## Run it

- **Locally:** open `index.html` in a browser. Keep all the files and folders together.
- **Local server (for YouTube playback):** YouTube will not play inside a page opened as a file. In the folder, run `python -m http.server 8000` and open `http://localhost:8000`.
- **On GitHub Pages:** push the folder, then enable Pages (Settings, Pages, deploy from the main branch). Open the link on your phone and use "Add to Home Screen".

## Cloud sync (optional)

The app can keep your data in a JSON file in your own Google Drive, so every device shares it. A small Google Apps Script web app does the reading and writing, so no keys live in this repo.

1. Go to script.google.com and create a new project.
2. Paste the script shown in the app (Backup tab, Cloud sync, "How to set it up") and change the secret.
3. Deploy as a Web app: Execute as Me, access Anyone.
4. On each device, open Backup, paste the link (ends with `/exec`) and your secret, and press Connect.

The app loads the file when it opens and saves to it a moment after each change. Newest change wins, so avoid editing on two devices at the same moment. Anyone with the link and secret can read and write the file, so keep both private. If you edit the script later, deploy a new version. Export backups still work as before.

## Your data

Data is stored in your browser's local storage, separately on each device and each web address. Clearing site data or using a private window removes it, so export a backup now and then from the Backup tab.

Video files picked from your device are not stored, so re-select the file when you reopen a recording. Links to YouTube or Drive carry over.

## Project structure

```
index.html            page shell, loads everything below
css/
  base.css            colors, fonts, page background, typography
  layout.css          sidebar, bottom tab bar, page width
  components.css      cards, buttons, forms, tags, stat tiles
  calendar.css        calendar grid and practice heatmap
js/
  store.js            data object, saving to localStorage, date and id helpers
  state.js            constants and UI state (current tab, open recording)
  utils.js            formatting helpers
  ui.js               shared snippets for the edit forms
  render.js           draws the sidebar and the current screen
  main.js             starts the app (loads last)
  logic/
    streaks.js        streak calculation
    focus.js          weak spots and improvement status
    tags.js           tag library and tag picker
    player.js         in-app video player (YouTube, Drive, files)
    search.js         search across everything
    sync.js           optional cloud sync through a Drive-backed web app
    timer.js          practice timer
  views/              what each screen looks like (one file per screen)
    today.js  review.js  pieces.js  resources.js  calendar.js  tags.js  search.js  progress.js  backup.js
  actions/            what the buttons do (add, edit, delete, import, export)
    review.js  pieces.js  resources.js  calendar.js  tags.js  backup.js
```

Scripts are plain files, not ES modules, so double-clicking `index.html` works without a server. Load order matters and is set at the bottom of `index.html`.

## Adding a screen

1. Create `js/views/yourscreen.js` with `V.yourscreen = function(){ return '...html...' };`
2. Add its actions in `js/actions/`.
3. Add the script tags to `index.html` and an entry in `TABS` in `js/state.js`.

## Stack

Plain HTML, CSS and JavaScript with no dependencies. Fonts (Inter and Fraunces) load from Google Fonts, with system fallbacks.
