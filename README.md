# GVV_OS — Cyberpunk Portfolio

A cinematic, cyberpunk-OS-styled portfolio for **Gabriel V. Verastigue**, built with plain HTML5, CSS3, and JavaScript (GSAP + AOS for motion, Font Awesome for icons). No build step required — open `index.html` in a browser or deploy the folder as-is to any static host (GitHub Pages, Netlify, Vercel).

## Structure

```
portfolio/
├── index.html              # All page markup/sections
├── assets/
│   ├── css/main.css        # Design tokens + all styling
│   ├── js/main.js          # Boot sequence, cursor, particles, nav, reveals, interactivity
│   ├── imgs/                # Put hero poster / other images here
│   └── video/                # Put your hero background video here
└── README.md
```

## Add your own hero video

The hero section expects a looping background video at:

```
assets/video/hero-loop.mp4
```

Until you add one, a neon gradient fallback background is shown automatically (see `.hero-bg-fallback` in `main.css`). Recommended: a short (8–15s), muted, 1080p+ cyberpunk-style loop, compressed to keep the page fast (aim under ~6MB). A poster frame can go at `assets/imgs/hero-poster.jpg`.

## Content source

All resume content (About, Skills, Experience, Projects, Education, Contact) was pulled from https://senpai-gab.github.io/profile/ and reworded/restyled for this cyberpunk format — nothing important was removed. The **Certifications** section currently ships with an empty state since no certifications were listed on the source page; swap in real cards whenever you have them (see `#certifications` in `index.html` for the panel markup pattern used elsewhere).

## Customizing

- **Colors / fonts / spacing**: all defined as CSS variables at the top of `assets/css/main.css` (`:root`) — change once, it cascades everywhere.
- **Nav sections**: edit both `.nav-links` and `.nav-mobile` in `index.html` (kept in sync manually, by design, to avoid JS-generated markup).
- **Skill bars**: each `.skill-bar` has a `data-value="NN"` attribute driving both the animated fill and the label — edit in place.
- **Projects**: duplicate a `.project-card` block, set its `data-category` to match one of the filter buttons in `.project-filters`.
- **Contact form**: currently front-end only (shows a confirmation message client-side). Wire it to a real backend or a service like Formspree by pointing the `<form>` at an action URL and letting it POST normally, or by extending `initContactForm()` in `main.js`.

## Performance & accessibility notes

- Respects `prefers-reduced-motion` (disables boot sequence, particle motion, cursor, typing effect, and speeds up all transitions).
- Keyboard focus states are visible (`:focus-visible`) throughout.
- Custom cursor and particle canvas are automatically disabled on touch/coarse-pointer devices.
- Lazy-loading candidate: if you add many project screenshots, add `loading="lazy"` to those `<img>` tags.
