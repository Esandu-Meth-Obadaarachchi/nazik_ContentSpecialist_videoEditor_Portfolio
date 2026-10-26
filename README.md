# Nazik Hamza, portfolio

Static React site (Vite + TypeScript, GSAP ScrollTrigger, Lenis). No backend, no database.
Design notes are in [DESIGN.md](DESIGN.md).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/
npm run preview   # serve the production build locally
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, S3). No server config needed.

## Where things live

| What | Where |
| --- | --- |
| All copy, stats, reel list, contact details | `src/data/content.ts` |
| Reel videos + posters | `public/media/reels/<id>.mp4` / `.jpg` |
| Edit showcase videos + stills | `public/media/edits/`, `public/media/video/` |
| Logos, car cutouts, portrait | `public/media/logos/`, `public/media/img/` |
| One section per file | `src/sections/` |

## Adding an edit video

All edits in the showcase play from self-hosted files in `public/media/edits/`.

1. Encode for the web (H.264, faststart so it streams):
   ```bash
   ffmpeg -i input.mov -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 25 -preset slow \
     -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k public/media/edits/my-edit.mp4
   ```
2. Add an entry to `edits` in `src/data/content.ts` with `src`, `poster` and `aspect`
   (`'16:9'`, `'9:16'` or `'1:1'`).
3. Optional hover-scrub thumbnails:
   ```bash
   ffmpeg -i public/media/edits/my-edit.mp4 -vf "fps=1,scale=192:108,tile=10x10" -frames:v 1 \
     public/media/edits/my-edit-sprite.jpg
   ```
   then add `sprite: { url, cols: 10, rows: 10, count: <frames>, interval: 1 }`.

## Long-form YouTube edits

The "Rolling with The Rosses" block plays YouTube videos in place (privacy-enhanced embed), so
nothing is self-hosted. Add a video to `rosses.videos` in `src/data/content.ts` and drop its
thumbnail at `public/media/rosses/<youtube-id>.jpg`. Totals and the view bars update on their own.

## Adding or updating a reel

Drop `xx-09.mp4` (720x1280, faststart) and a `xx-09.jpg` poster into `public/media/reels/`, then
add an entry to that brand's `reels` array with `hook`, optional Sinhala `original`, the public
`url`, and `views` per platform. The feed sorts by total views automatically.

## How video playback works

- Reels are self-hosted MP4s inside a custom phone UI. The visible reel in each feed autoplays
  muted; tapping it turns sound on, tapping again pauses. Sound preference carries to the next reel.
- Only one video plays at a time across the page.
- Videos pause when scrolled off-screen and load nothing until needed (`preload="none"`).
- `prefers-reduced-motion`: no autoplay, no smooth scroll or pinned animations, native cursor.

## Hosting note

`public/media/reels` is about 145 MB. That is fine on Vercel/Netlify/Cloudflare, but if the
host has a size cap, move `public/media` to a CDN bucket and update the paths in `content.ts`.
