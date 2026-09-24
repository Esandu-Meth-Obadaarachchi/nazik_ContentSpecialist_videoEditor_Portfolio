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

## Before publishing

1. **Contact details**: `person.contact` in `src/data/content.ts` is a placeholder
   (`hello@example.com`). Fill in email, and optionally phone / LinkedIn / Instagram; each
   link only renders when it has a value.

## Adding the missing edit videos

The edit showcase lists five items that show a still for now. When the files arrive:

1. Encode for the web (H.264, faststart so it streams):
   ```bash
   ffmpeg -i input.mov -vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 23 -preset slow \
     -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k public/media/edits/crowdfunder.mp4
   ```
   For 9:16 explainers use `scale=720:-2` instead.
2. In `src/data/content.ts`, add `src: '/media/edits/<name>.mp4'` to that item in `edits`.
   The "Still" label disappears and the monitor gets full playback controls.
3. Optional hover-scrub thumbnails (like the car edit):
   ```bash
   ffmpeg -i public/media/edits/crowdfunder.mp4 -vf "fps=2,scale=192:108,tile=10x5" -frames:v 1 \
     public/media/edits/crowdfunder-sprite.jpg
   ```
   then add `sprite: { url: '/media/edits/crowdfunder-sprite.jpg', cols: 10, rows: 5, count: <seconds*2>, interval: 0.5 }`.

If he sends links (Drive, YouTube, Facebook) rather than files, download the source first; the
site plays self-hosted MP4s so it works everywhere, including iPhone Safari.

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
