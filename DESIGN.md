# Nazik Hamza, portfolio design

## Concept: "The Cut"

Nazik's craft lives inside an edit suite: timecode, playhead, the 9:16 frame, the slate, the
transition. The site *is* that suite. Every structural device on the page is borrowed from a real
editing or production artifact, and each one carries real information.

- **Page = sequence.** A timeline docked at the bottom of the screen is the navigation. Each chapter
  is a clip on the track, sized to its real length on the page, coloured like an NLE clip label. The
  playhead is the scroll position; the timecode is the page's runtime.
- **Hero = the reframe.** The site opens on a 2.39:1 cinemascope frame playing Nazik's own car edit.
  Scrolling closes the frame in from the sides until it becomes a 9:16 reel inside a phone. That is
  his career in one motion: video editor, reframed for the feed. The name, set in Archivo's variable
  width axis, condenses from 125 to 62 width as the frame narrows.
- **Brand chapters = edit transitions.** Each client is introduced by a classic transition matched to
  the brand:
  - Dongfeng (EV, "Features over Flash"): the lime Box *drives* the push-wipe, wheels spinning, and
    paints the page electric blue behind it. Results read as a battery charging.
  - Jetour ("Made in China"): dip to black, headlights ignite, a flashlight follows the cursor over
    the T2. Sales read on a speedometer needle sweeping 50 to 150.
  - Timekeeper: a clock wipe in navy and gold. A dial's hands track scroll.
  - The Butler: a bow-tie iris wipe built from the brand mark itself.
  - Edit bay: a program monitor and media bin, with a frame-accurate scrub preview.
- **Cursor = focus reticle.** Four AF brackets that lock onto whatever you can press, turn into a
  play control over video, and take the colour of the chapter you're in.
- **Close = end credits.** A credit roll where the roles are real (strategy, scripts, direction,
  edit) and the last card is the contact.

## Tokens

| Role | Value |
| --- | --- |
| Suite (base) | `#0D0D0F` |
| Panel | `#141417` |
| Rule | `#26262B` |
| Paper (text) | `#ECEBE7` |
| Dim (secondary) | `#8A8A92` |
| Tally / REC (semantic only: rec dot, playhead) | `#FF3B2F` |
| Dongfeng | blue `#3E5CFF`, lime `#CDEB35`, mint `#19F5A4` |
| Jetour | black `#070708`, silver-lavender `#B3B5DC`, headlight `#F4F6FF` |
| Timekeeper | navy `#1B2237`, gold `#D2AE55` |
| The Butler | linen `#E7E3DB`, ink `#141414` |

Type:
- **Archivo** (variable, `wdth` 62-125, `wght` 100-900): display and body. Width is the expressive
  axis: wide for titles, normal for reading, condensed as a motion state.
- **Martian Mono**: timecode, data labels, metadata.
- **Yaldevi**: Sinhala. The original Sinhala hooks sit beside their translations, because Nazik's
  method starts with the audience's own language.
- **Cinzel**: The Butler chapter only, echoing the brand's Trajan-style mark.

Radius scale: frames 0, phones 48 (device-true), controls pill.

## Motion rules

- Scroll choreography runs on GSAP ScrollTrigger over Lenis smooth scroll; only `transform`,
  `opacity`, `clip-path` and `filter` animate.
- One orchestrated moment per chapter (the transition), quiet everywhere else.
- `prefers-reduced-motion`: no smooth scroll, no pinning theatrics, native cursor, videos don't
  autoplay, content is fully readable statically.
- Touch devices get the native cursor and swipeable reel feeds.

## Video

All reels are self-hosted H.264 MP4 (720x1280, faststart) with posters, so they play inside the
custom phone UI on every browser including iOS Safari. Only one video plays at a time. Missing
edits show their still until a file is added in `src/data/content.ts`.
