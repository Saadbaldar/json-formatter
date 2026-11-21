# JSON Formatter

A clean, dark-themed developer tool to format, minify and validate JSON — entirely in the browser.

## Features

- **Format (2 spaces)** and **Format (4 spaces)** — pretty-prints JSON with the chosen indent.
- **Minify** — removes all unnecessary whitespace.
- **Validate** — checks the JSON with `JSON.parse` and shows a "Valid JSON" badge, or a clear error message.
- **Error position** — when the browser's error message contains a character position, the tool converts it to a line and column number and shows it in the error message; invalid input is also highlighted with a red border.
- **Stats** — on success, shows the JSON type (object / array / primitive), the top-level key count (objects) or item count (arrays), and the input/output sizes in characters.
- **Copy result** — uses `navigator.clipboard` with a fallback for older browsers, and shows a brief "Copied!" confirmation.
- **Load sample** — fills the input with a realistic sample (a user object with a nested address, tags array, skills and social links).
- **Clear** — empties both panels.
- **Keyboard shortcut** — `Ctrl` + `Enter` (or `Cmd` + `Enter` on Mac) formats with 2-space indent.
- **Responsive** — the two panels stack vertically on small screens.

## How to run

No build step, no dependencies, no server needed.

**Option 1 — open the file directly:**

```text
Open index.html in any modern browser.
```

**Option 2 — serve it statically (optional):**

```bash
# from this folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

**Option 3 — GitHub Pages:** push this folder's contents to a repository and enable GitHub Pages on the branch — the site works as-is, since it is purely static.

## Privacy

100% client-side. There is no API, no server call and no tracking — pasted JSON never leaves the browser.
