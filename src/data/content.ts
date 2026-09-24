// Every piece of copy, every number and every video on the site lives here.
// To add a missing edit later, drop the mp4 into /public/media and set its `src`.

export type Views = { ig: number | null; fb: number | null; tt: number | null; approx?: Array<'ig' | 'fb' | 'tt'> }

export type Reel = {
  id: string
  hook: string // English hook / title
  original?: string // hook as written, in Sinhala
  url: string // where it was published
  src?: string // self-hosted mp4
  poster: string
  views?: Views
}

export type Edit = {
  id: string
  title: string
  kind: string
  aspect: '16:9' | '9:16'
  poster: string
  src?: string
  sprite?: { url: string; cols: number; rows: number; count: number; interval: number }
}

export const person = {
  first: 'Nazik',
  last: 'Hamza',
  full: 'Mohamed Nazik Hamza',
  roles: ['Brand & content strategist', 'Automotive marketing lead', 'Video editor'],
  // TODO(nazik): replace with real contact details before publishing.
  contact: {
    email: 'hello@example.com',
    phone: '',
    linkedin: '',
    instagram: '',
  },
}

export const about = {
  lead:
    "Hello, I'm Nazik. For nearly five years I've shaped how automotive and lifestyle brands connect with their audiences in Sri Lanka.",
  body: [
    "I own the full arc of a brand's content: strategy and positioning, scripting and shoot planning, on-set direction, and the final edit, with a team of editors, designers and social media managers executing alongside me.",
    'Before I write a single script, I start by understanding exactly who the target customer is: their culture, language and everyday reality. Then I build the strategy around what will genuinely resonate with them.',
  ],
  philosophy: 'Great brand content starts with story, not slogans.',
  philosophyNote:
    'I lead with character, situation and tension, and let the brand message surface through the resolution instead of announcing it.',
  facts: [
    { label: 'Combined views', value: 117, suffix: 'M+', decimals: 0 },
    { label: 'Automotive accounts led', value: 4, suffix: '', decimals: 0 },
    { label: 'Years in content', value: 5, suffix: '', prefix: '~', decimals: 0 },
  ],
  award: { name: 'SLIM DIGIS 2026', tier: 'Bronze', for: 'Jetour Sri Lanka' },
}

export const pipeline = [
  {
    id: 'audience',
    title: 'Know the audience',
    body: 'Culture, language, everyday reality. Before a single script, I learn who is watching and what they actually worry about.',
    tag: 'Research',
  },
  {
    id: 'strategy',
    title: 'Find the wedge',
    body: 'Positioning that a skeptical buyer can check for themselves. Features over flash for Dongfeng. Design as the pitch for Jetour.',
    tag: 'Brand strategy',
  },
  {
    id: 'ideas',
    title: 'Ideation',
    body: 'Formats built for the feed, not the showroom: skits, challenges, customer interviews, explainers, humour.',
    tag: 'Concepts',
  },
  {
    id: 'script',
    title: 'Script it',
    body: 'Character, situation, tension. The product shows up in the resolution, the hook lands in the first second.',
    tag: 'Scriptwriting',
  },
  {
    id: 'shoot',
    title: 'Direct the shoot',
    body: 'On set with talent, crews and real owners. 32 unscripted owner testimonials for Jetour alone, in Sinhala and English.',
    tag: 'Creative direction',
  },
  {
    id: 'edit',
    title: 'Cut it',
    body: 'Pacing, captions and sound, frame by frame. The edit is where I started, and it is still where the story is won.',
    tag: 'Video editing',
  },
  {
    id: 'scale',
    title: 'Publish, then scale',
    body: 'Facebook, Instagram, TikTok and YouTube at once. Organic performance decides what paid media gets to amplify.',
    tag: 'Distribution',
  },
]

export const experience = {
  company: 'Zirateh',
  takes: [
    {
      role: 'Junior Video Editor',
      from: 'Oct 2021',
      to: 'Oct 2023',
      body: 'Edited short-form social content across multiple personal brand accounts, building foundational skills in pacing, storytelling and brand-consistent visual style.',
    },
    {
      role: 'Senior Video Editor',
      from: 'Oct 2023',
      to: 'Dec 2024',
      body: "Led video production and post-production for international personal brand clients, developing each client's distinct visual style and managing delivery timelines. Mentored junior editors to execute that style consistently.",
    },
    {
      role: 'Content Specialist',
      from: 'Dec 2024',
      to: 'Present',
      body: 'Own end-to-end content for major brands in Sri Lanka, from scriptwriting and shoot direction to the final edit. Lead a team of editors, graphic designers and social media managers across delivery timelines and content calendars, and develop brand strategy and scripted content engineered for organic reach.',
    },
  ],
}

export const roster = [
  { name: 'Dongfeng', logo: '/media/logos/dongfeng-wordmark.png', h: 26 },
  { name: 'Jetour', logo: '/media/logos/jetour.png', h: 46 },
  { name: 'The Butler', logo: '/media/logos/butler-mono.png', h: 74 },
  { name: 'Perodua', logo: '/media/logos/perodua.png', h: 70 },
  { name: 'Forthing', logo: '/media/logos/forthing.png', h: 72 },
  { name: 'Timekeeper', logo: '/media/logos/timekeeper.png', h: 76 },
]

const r = (id: string) => ({ src: `/media/reels/${id}.mp4`, poster: `/media/reels/${id}.jpg` })

export const dongfeng = {
  client: 'Dongfeng Sri Lanka (Box)',
  period: 'Jun 2025 - May 2026',
  platforms: ['Facebook', 'Instagram', 'TikTok', 'YouTube'],
  title: 'Features over Flash',
  summary:
    "How Dongfeng built trust and sales in Sri Lanka's most price-sensitive, comparison-driven EV segment, with zero borrowed credibility to start from.",
  charge: [
    { value: 54.6, suffix: 'M+', decimals: 1, label: 'Cross-platform views' },
    { value: 43.1, suffix: 'K', decimals: 1, label: 'Facebook followers gained' },
    { value: 432.5, suffix: 'K', decimals: 1, label: 'Content interactions' },
    { value: 200, prefix: '+', suffix: '%', decimals: 0, label: 'Monthly sales growth' },
  ],
  challengeTitle: 'Our biggest challenge? A comparison-obsessed buyer.',
  challenges: [
    {
      title: 'No borrowed credibility anywhere',
      body: 'Dongfeng had no market anywhere in the world where the brand was already established. Credibility had to be built entirely from scratch.',
    },
    {
      title: 'A competitive sandwich',
      body: 'Cheaper brands undercut on price, while BYD sat just above with a broadly similar product and credibility Dongfeng didn’t yet have. No obvious wedge on either side.',
    },
    {
      title: 'An extremely comparison-driven segment',
      body: 'In the Rs. 8M-12M bracket, buyers compare specs feature by feature. One or two missing features can lose the sale to a competitor.',
    },
    {
      title: 'Extreme price sensitivity',
      body: 'Buyers switch to a cheaper vehicle over a difference of just Rs. 300,000-400,000, and a meaningful share are also weighing the used-car market, not just other EVs.',
    },
  ],
  strategyTitle: "Win the spec sheet, then win the buyer's actual budget anxiety.",
  strategyBody:
    'Rather than asking buyers to pay more on trust alone, the strategy gave them a concrete, checkable reason the Box was the better feature-for-price choice, in a segment already comparing it feature by feature regardless.',
  pillars: [
    {
      title: 'Infotainment content',
      body: 'Every piece communicated brand and product messaging in an entertaining way: skits, challenges, humour.',
    },
    {
      title: 'Feature-forward, not flash-forward',
      body: "Content isolated specific features the Box had that competitors in the same bracket didn't, verified against buyers' actual priorities.",
    },
    {
      title: 'Multi-platform short-form',
      body: 'Run simultaneously across TikTok, YouTube, Facebook and Instagram. ~16.0M organic views on Meta alone.',
    },
    {
      title: 'Sharp pain points',
      body: 'Content aimed squarely at what this buyer was facing: rising petrol costs and the falling resale value of their old second-hand vehicle.',
    },
  ],
  platformViews: [
    { name: 'Facebook', value: 45.2 },
    { name: 'Instagram', value: 5.7 },
    { name: 'TikTok', value: 3.7 },
  ],
  extra: [
    { value: 441.2, suffix: 'K', decimals: 1, label: 'Facebook page visits' },
    { value: 33, suffix: '%', decimals: 0, label: 'Combined organic view share (paid carried the rest)' },
  ],
  sales: { before: 14, after: 42, beforeLabel: 'Jun - Aug 2025', afterLabel: 'Dec 2025 - Mar 2026', goal: 800 },
  reels: [
    { id: 'df-01', hook: "Sri Lanka's next smartest investment", original: 'ලංකාවේ ඊළඟ Smartම Investment එක', url: 'https://www.facebook.com/reel/2868294236699742', views: { ig: 800_000, fb: 1_100_000, tt: 808_000, approx: ['ig'] }, ...r('df-01') },
    { id: 'df-05', hook: 'An EV for under Rs. 12 million?', original: 'ලක්ෂ 120 කට අඩු EV එකක් තියෙනවා ද?', url: 'https://www.facebook.com/reel/1293516149356459', views: { ig: 100_000, fb: 809_000, tt: 508_400, approx: ['ig'] }, ...r('df-05') },
    { id: 'df-03', hook: "The Box's self-parking feature", original: 'DONGFENG BOX එකේ SELF-PARKING FEATURE එක', url: 'https://www.facebook.com/reel/820487697208249', views: { ig: 114_000, fb: 466_000, tt: 288_600 }, ...r('df-03') },
    { id: 'df-02', hook: 'The best way to cut your monthly transport bill', original: 'මාසෙට TRANSPORT වියදම අඩු කරන හොඳම ක්‍රමය', url: 'https://www.facebook.com/reel/1233213975224999', views: { ig: 4_500, fb: 435_000, tt: 180_300 }, ...r('df-02') },
    { id: 'df-06', hook: "Why's he in such a hurry?", original: 'ඇයි මෙයාට හදිස්සි?', url: 'https://www.facebook.com/reel/924245996768454', views: { ig: 33_900, fb: 425_000, tt: 167_000 }, ...r('df-06') },
    { id: 'df-04', hook: 'The Box, walked around', url: 'https://www.facebook.com/reel/2502981690076966', views: { ig: 4_300, fb: 396_000, tt: 145_000 }, ...r('df-04') },
    { id: 'df-07', hook: "He won't let me leave", original: 'මෙයා මට යන්න දෙන්නෙ නෑ', url: 'https://www.facebook.com/reel/1305742548032743', views: { ig: 7_700, fb: 177_000, tt: 73_300 }, ...r('df-07') },
    { id: 'df-08', hook: "Who's he trying to sell it to?", original: 'මෙයා කාටද විකුණන්න හදන්නෙ?', url: 'https://www.facebook.com/reel/1467450605021227', views: { ig: 4_900, fb: 107_000, tt: 50_500 }, ...r('df-08') },
  ] as Reel[],
}

export const jetour = {
  period: 'Jun 2025 - May 2026',
  title: 'Made in China',
  summary: "How Jetour earned trust from zero in Sri Lanka's most skeptical vehicle category.",
  views: 62.9,
  challengeLead: 'We were selling a Chinese SUV to a market primed to distrust it.',
  challenges: [
    {
      title: 'Zero brand recognition, island-wide',
      body: 'No followers, no page history. The one exception was Sri Lankans with Middle East ties, where Jetour had already gained visibility.',
    },
    {
      title: 'Sharp skepticism at the SUV price tier',
      body: 'Chinese brands faced far more resistance at Rs. 15M-60M+ than in the budget segment. BYD was the one Chinese name that had broken through; the rest, Jetour included, were still fighting for legitimacy.',
    },
    {
      title: 'A credibility and age problem',
      body: 'Jetour has existed as a manufacturer for only five years, in a category where buyers expect a decade or more of ownership history and resale confidence.',
    },
    {
      title: 'Weakest products first',
      body: 'For the first 4-5 months, content centred on lesser-known models, not the flagship T1/T2. The hardest part of the trust-building job, done with the least compelling products.',
    },
  ],
  insight:
    'Many Middle East-based Sri Lankans already recognised Jetour there, associating its Defender-like design with aspiration. A pre-earned trust the campaign could build on.',
  pillars: [
    {
      title: 'Design as the core pitch',
      body: 'The same aspirational visual status as a Rs. 50-60M+ premium SUV, at a fraction of the price. Design and aesthetics were a primary content pillar, not an afterthought.',
    },
    {
      title: 'Organic first, paid second',
      body: '13.0M Facebook and 1.7M Instagram views came from unpaid reach before any paid media. Organic performance was the live filter for what to scale.',
    },
    {
      title: '32 real owner testimonials',
      body: 'Unscripted, in-the-moment stories from owners and motor-show visitors, filmed over 11 months in Sinhala and English. Trust normalised through visible peers, not brand claims.',
    },
    {
      title: 'Creative messaging',
      body: 'Brand and product messaging told through creative short-form formats, not the usual car advertisement.',
    },
  ],
  platformViews: [
    { name: 'Facebook', value: 47.1 },
    { name: 'Instagram', value: 9.3 },
    { name: 'TikTok', value: 6.5 },
  ],
  stats: [
    { value: 43.9, suffix: 'K', decimals: 1, label: 'Followers gained across all platforms' },
    { value: 368.3, suffix: 'K+', decimals: 1, label: 'Total content interactions' },
    { value: 622.6, suffix: 'K', decimals: 1, label: 'Page and profile visits' },
    { value: 108, suffix: '', decimals: 0, label: "Reels that drove 29.7M of Facebook's 47.1M views" },
  ],
  sales: { before: 50, after: 150, beforeLabel: 'Jul - Sep 2025', afterLabel: 'Dec 2025 - Feb 2026', goal: 1000 },
  leads: { total: 33071, calls: 20271, leads: '12.8K' },
  reels: [
    { id: 'jt-01', hook: 'Walked in to buy a T2', url: 'https://www.facebook.com/reel/1732809848084091', views: { ig: 736_000, fb: 646_000, tt: 575_500 }, ...r('jt-01') },
    { id: 'jt-02', hook: 'Why did he choose this one?', original: 'මෙයා ඇයි මේ වාහනය තෝරා ගත්තෙ?', url: 'https://www.facebook.com/reel/4551390148466587', views: { ig: 623_000, fb: 605_000, tt: 184_600 }, ...r('jt-02') },
    { id: 'jt-06', hook: 'What do you think of this one?', original: 'මේ වාහනේ ගැන මොනවද හිතන්නේ?', url: 'https://www.facebook.com/reel/25411165295179253', views: { ig: 500_000, fb: 600_000, tt: 248_600, approx: ['ig', 'fb'] }, ...r('jt-06') },
    { id: 'jt-04', hook: 'What do you think of the T1?', original: 'JETOUR T1 එක ගැන මොනවද හිතන්නේ?', url: 'https://www.facebook.com/reel/923170450287373', views: { ig: 2_500, fb: 276_000, tt: 52_600 }, ...r('jt-04') },
    { id: 'jt-03', hook: 'What made him buy a Jetour T2?', url: 'https://www.facebook.com/reel/1456011212909062', views: { ig: 7_600, fb: 209_000, tt: 88_700 }, ...r('jt-03') },
    { id: 'jt-05', hook: "What's the problem with your vehicle?", url: 'https://www.facebook.com/reel/978713005327072', views: { ig: 14_000, fb: 201_000, tt: 59_000 }, ...r('jt-05') },
  ] as Reel[],
}

export const timekeeper = {
  title: 'Watch talk people actually watch',
  summary: 'Short-form for a luxury watch house: care tips, collection tours and strong opinions, fronted in English and Sinhala.',
  reels: [
    { id: 'tk-01', hook: '3 tips to avoid ruining your watch', url: 'https://www.instagram.com/reel/DGnjodbTj_X/', views: { ig: 1_300_000, fb: 31_000, tt: 742_700 }, ...r('tk-01') },
    { id: 'tk-02', hook: "Sri Lanka's biggest luxury watch collection", url: 'https://www.facebook.com/reel/687668270903008', views: { ig: null, fb: 1_000_000, tt: 934_700 }, ...r('tk-02') },
    { id: 'tk-03', hook: "Apple Watches aren't real watches", url: 'https://www.facebook.com/reel/415564764974751', views: { ig: null, fb: 157_000, tt: 237_600 }, ...r('tk-03') },
  ] as Reel[],
}

export const butler = {
  title: 'Aesthetic Direction',
  summary:
    "A set of videos built around refined art direction, styling every shot to match the brand's premium identity for a men's leather accessories client.",
  reels: [
    { id: 'bt-01', hook: 'Why is this wallet so popular?', url: 'https://www.tiktok.com/@thebutlersrilanka/video/7567636797983919378', ...r('bt-01') },
    { id: 'bt-02', hook: 'On our suspect.', url: 'https://www.facebook.com/reel/1750803788960412', ...r('bt-02') },
    { id: 'bt-03', hook: 'Every gentleman needs', url: 'https://www.facebook.com/reel/755308560738767', ...r('bt-03') },
    { id: 'bt-04', hook: 'You!', url: 'https://www.facebook.com/reel/1323323905866393', ...r('bt-04') },
  ] as Reel[],
}

export const edits: Edit[] = [
  {
    id: 'car-edit',
    title: 'Car edit',
    kind: 'Cinematic spec edit',
    aspect: '16:9',
    poster: '/media/video/car-edit.jpg',
    src: '/media/video/car-edit.mp4',
    sprite: { url: '/media/video/car-edit-sprite.jpg', cols: 10, rows: 5, count: 43, interval: 0.5 },
  },
  { id: 'crowdfunder', title: 'Crowdfunder film', kind: 'Campaign video', aspect: '16:9', poster: '/media/edits/crowdfunder.jpg' },
  { id: 'explainer-1', title: 'Tradition, your brand, technology', kind: 'Explainer', aspect: '9:16', poster: '/media/edits/explainer-1.jpg' },
  { id: 'explainer-2', title: 'Ceramic vs plastic', kind: 'Explainer', aspect: '9:16', poster: '/media/edits/explainer-2.jpg' },
  { id: 'explainer-3', title: 'Found on Google', kind: 'Explainer', aspect: '9:16', poster: '/media/edits/explainer-3.jpg' },
  { id: 'explainer-4', title: 'The dream home', kind: 'Explainer', aspect: '9:16', poster: '/media/edits/explainer-4.jpg' },
]

export const credits = [
  { role: 'Brand strategy', names: [person.full] },
  { role: 'Creative direction', names: [person.full] },
  { role: 'Scripts', names: [person.full] },
  { role: 'Shoot direction', names: [person.full] },
  { role: 'Edit', names: [person.full] },
  { role: 'Brands', names: ['Dongfeng Sri Lanka', 'Jetour Sri Lanka', 'Timekeeper', 'The Butler', 'Perodua', 'Forthing'] },
  { role: 'Studio', names: ['Zirateh'] },
  { role: 'Recognition', names: ['SLIM DIGIS 2026, Bronze (Jetour)'] },
]

export const chapters = [
  { id: 'intro', label: 'Intro', color: '#5A5A63', cursor: '#ECEBE7' },
  { id: 'about', label: 'About', color: '#6E6E78', cursor: '#ECEBE7' },
  { id: 'process', label: 'Process', color: '#7B7B86', cursor: '#ECEBE7' },
  { id: 'experience', label: 'Experience', color: '#8A8A95', cursor: '#ECEBE7' },
  { id: 'dongfeng', label: 'Dongfeng', color: '#3E5CFF', cursor: '#CDEB35' },
  { id: 'jetour', label: 'Jetour', color: '#B3B5DC', cursor: '#B3B5DC' },
  { id: 'timekeeper', label: 'Timekeeper', color: '#D2AE55', cursor: '#D2AE55' },
  { id: 'butler', label: 'The Butler', color: '#E7E3DB', cursor: '#141414' },
  { id: 'edits', label: 'Edits', color: '#FF3B2F', cursor: '#ECEBE7' },
  { id: 'contact', label: 'Contact', color: '#ECEBE7', cursor: '#ECEBE7' },
] as const

export type ChapterId = (typeof chapters)[number]['id']
