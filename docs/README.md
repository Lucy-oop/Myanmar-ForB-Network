# Myanmar FoRB Network — website

Static site: plain HTML, CSS and JavaScript. No build step and no dependencies apart from Google Fonts (Archivo, Source Serif 4).
Open `index.html` in a browser, or upload the whole `site/` folder to any static host (Netlify, Vercel, GitHub Pages, cPanel, etc.).

## Pages
| File | Page |
|---|---|
| `index.html` | Home: FoRB in Myanmar, census, faiths, post-coup stats, our response, vision |
| `about.html` | About Us: data and charts, about the network, vision, what we do, sustainability, members |
| `insights.html` | Insights: featured report and filterable list (**sample content**) |
| `learning.html` | FoRB Learning: key concepts, international standards, modules (**sample modules**) |
| `contact.html` | Contact Us: contact details (**to confirm**), safety notice, form |

## Before launch
1. **Data.** Put the real figures in `assets/js/data.js`, set `isPlaceholder: false`, then delete the demo block at the bottom of that file. The yellow "Sample data" flags on the stats disappear automatically.
2. **Insights and Learning cards.** Replace the sample items with real publications and modules, and remove the "Sample content" flags.
3. **Contact form.** No public email address is shown, at the client's request. The form still needs a backend that forwards messages privately, for example Formspree or Netlify Forms. It is front-end only right now: see the `TODO` in `assets/js/main.js`.
3b. **Newsletter (FoRB Media Watch).** The sign-up section sits above the footer on every page (`#newsletter`). To make it live:
   1. Create a free Mailchimp account and an Audience. Go to **Audience → Signup forms → Embedded form** and copy the URL from `<form action="…">`.
   2. Paste that URL into `NEWSLETTER_ACTION` in `../_build/build.py`, then rebuild. Visitors stay on the page and see a "check your inbox" message (Mailchimp sends a confirmation email).
   3. Automatic emails: in Mailchimp, set up an automation that sends a **welcome email** to every new subscriber. Then send each Media Watch issue as a regular or scheduled campaign to the whole audience.
   4. Until a URL is set, the form runs in demo mode and sends nothing.
   Other services (Brevo, MailerLite and similar) also work. Paste their hosted form URL instead, and the form will open it in a new tab.
4. **Photos.** Every photo except the logo was collected from third-party sites. **Replace them or license them** before going public.

## Editing header/footer
The header, footer and `<head>` are repeated in each page. To change them on every page at once, edit `../_build/build.py`, edit the page bodies in `../_build/pages/`, then run:

```
python3 ../_build/build.py "$PWD"
```

This **overwrites** the five HTML files. Either always edit through `_build/`, or edit the HTML directly and stop using the generator.

## Animations (in `assets/js/main.js` and `assets/css/styles.css`)
- `data-effect="slide-left | slide-right | slide-bottom | fade | mask"`: the element slides or reveals in when scrolled into view. Add `data-delay="1|2|3"` to stagger elements.
- `class="rise"` on a heading: the words rise in one by one.
- `.v-line`: a vertical connecting line that draws itself on scroll.
- Page transitions: a curtain in the six logo colours covers and uncovers the screen between pages.
- Other motion: a slow zoom on the hero photo, a header that hides on scroll, a full-screen mobile menu and underline hover effects on links.
- `data-count="30"` (optional `data-from="2000"`): the number counts up when it scrolls into view.
- `class="stagger"` on a list: its items rise in one after another.
- `.page-hero`: the full-width photo hero on the inner pages (breadcrumb, title, 3 fact chips, six-colour band, scroll cue). Copy one from `_build/pages/about.html`.
- Timelines: `.tl-strip` (home) and `.std-tl` (Learning) draw their line and pop their dots on scroll.
- `class="clampable"` on a long paragraph: on phones it is shortened with a "Read more" button.
- Scroll reveals fire when the element is actually on screen; anything already scrolled past is shown at once, so nothing can stay hidden.
- All of it is switched off for visitors who set "reduce motion" in their system settings.
