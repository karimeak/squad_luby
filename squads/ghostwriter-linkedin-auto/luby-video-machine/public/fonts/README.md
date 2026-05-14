# Aspekta fonts go here

This project uses **Aspekta** as the brand display/body font. To get
brand-correct rendering, drop the following files into this folder:

    Aspekta-400.woff2   (regular)
    Aspekta-500.woff2   (medium)
    Aspekta-600.woff2   (semibold)
    Aspekta-700.woff2   (bold)
    Aspekta-900.woff2   (black)

If any of these files are missing, the project automatically falls back to
**Inter** (loaded from Google Fonts via `@remotion/google-fonts`), so
previews and renders will still work — they just won't match the Luby brand
exactly.

If your team only has TTF/OTF files, convert them to WOFF2 first
(any modern converter works). WOFF2 is required for size and performance.
