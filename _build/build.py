import sys, os, re, hashlib

GEN = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]

NAV = [("index.html", "Home"), ("about.html", "About Us"), ("insights.html", "Insights"),
       ("learning.html", "FoRB Learning"), ("contact.html", "Contact Us")]

# Vector logo mark (6 figures as separate groups, for the hero "gathering" animation).
# Generated from assets/img/logo-mark.png by _build/trace_logo.py.
# Cache-busting: a short hash of each asset is added to its URL (styles.css?v=ab12cd34),
# so browsers fetch the new file after every update instead of a stale cached copy.
def ver(rel):
    with open(os.path.join(OUT, rel), "rb") as f:
        return rel + "?v=" + hashlib.md5(f.read()).hexdigest()[:8]

HERO_LOGO = open(os.path.join(GEN, "hero-logo.svg"), encoding="utf-8").read().strip()

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

def head(title, desc, og_img):
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="assets/img/{og_img}">
  <meta name="theme-color" content="#14202e">
  <link rel="icon" type="image/png" href="assets/img/logo-mark.png">
  <script>document.documentElement.className+=" js is-entering";setTimeout(function(){{var r=document.documentElement;if(r.classList.contains("is-entering")){{r.classList.remove("is-entering");r.classList.add("is-entered")}}}},2500);</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{ver('assets/css/styles.css')}">
</head>
<body>
<div class="curtain" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
<a class="skip-link" href="#main">Skip to content</a>
'''

def header(cur):
    items = []
    for href, label in NAV[:-1]:
        ac = ' aria-current="page"' if href == cur else ''
        items.append(f'        <li><a class="u-link u-link--fade" href="{href}"{ac}>{label}</a></li>')
    ac = ' aria-current="page"' if cur == "contact.html" else ''
    items.append(f'        <li><a class="btn btn--sm" href="contact.html"{ac}>Contact Us</a></li>')
    mitems = "\n".join(
        f'      <li><a href="{h}"{" aria-current=\"page\"" if h == cur else ""}>{l}</a></li>' for h, l in NAV)
    return f'''<div class="band" aria-hidden="true"></div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Myanmar FoRB Network — Home">
      <img src="assets/img/logo-mark.png" alt="" width="48" height="53">
      <span class="brand-name">Myanmar FoRB Network<span class="brand-tag">FREEDOM IS OUR FAITH</span></span>
    </a>
    <nav class="nav" aria-label="Main">
      <ul>
{chr(10).join(items)}
      </ul>
    </nav>
    <button class="burger" aria-expanded="false" aria-controls="m-menu" aria-label="Open menu"><span></span><span></span><span></span></button>
  </div>
</header>

<div class="m-menu" id="m-menu" aria-hidden="true" role="dialog" aria-label="Menu">
  <div class="m-menu__top">
    <span class="m-menu__title">Menu</span>
    <button class="m-menu__close" aria-label="Close menu"></button>
  </div>
  <nav aria-label="Mobile">
    <ul>
{mitems}
    </ul>
  </nav>
  <div class="m-menu__foot">
    <span class="hashtag">#FreedomIsOurFaith</span>
    <img src="assets/img/logo-mark.png" alt="" width="40" height="44">
  </div>
</div>
'''

# Paste the Mailchimp embedded-form action URL here (Audience → Signup forms → Embedded form → copy the
# <form action="..."> value), e.g. https://xxxx.us21.list-manage.com/subscribe/post?u=XXXX&amp;id=YYYY
# Any other provider's hosted form URL also works (it opens in a new tab). Leave empty = demo mode.
NEWSLETTER_ACTION = ""

NEWSLETTER = f'''
<section class="newsletter" id="newsletter" aria-labelledby="nl-title">
  <div class="wrap newsletter__grid">
    <div>
      <span class="eyebrow">Newsletter</span>
      <h2 id="nl-title" class="rise">Subscribe to <em class="hl">FoRB Network</em></h2>
      <p data-effect="slide-bottom">Regular updates from the Myanmar FoRB Network, delivered to your inbox: the FoRB situation in Myanmar, violations documented, new reports, events and statements from the Network.</p>
    </div>
    <form class="nl-form" data-effect="slide-bottom" action="{NEWSLETTER_ACTION}" method="post" target="_blank" novalidate>
      <div class="nl-row">
        <div class="field">
          <label for="nl-email">Email address *</label>
          <input id="nl-email" name="EMAIL" type="email" autocomplete="email" required placeholder="you@example.com">
        </div>
        <div class="field">
          <label for="nl-name">First name <small>(optional)</small></label>
          <input id="nl-name" name="FNAME" autocomplete="given-name" placeholder="Or a pseudonym">
        </div>
      </div>
      <div class="nl-hp" aria-hidden="true"><input type="text" name="b_hp" tabindex="-1" value="" autocomplete="off"></div>
      <label class="check"><input type="checkbox" name="consent" required> <span>I agree to receive the FoRB Network newsletter. I can unsubscribe at any time using the link in every email. *</span></label>
      <div class="nl-actions">
        <button class="btn" type="submit">Subscribe <span aria-hidden="true">→</span></button>
        <small>We never share your email. You can use a pseudonym.</small>
      </div>
      <p class="nl-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
'''

FOOTER = NEWSLETTER + f'''
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <span class="hashtag">#FreedomIsOurFaith</span>
      <a class="arrow-link" href="#newsletter">Subscribe to FoRB Network <span class="ar">{ARROW}</span></a>
    </div>
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html">
          <img src="assets/img/logo-mark.png" alt="" width="48" height="53">
          <span class="brand-name">Myanmar FoRB Network<span class="brand-tag">FREEDOM IS OUR FAITH</span></span>
        </a>
        <p>An independent, inclusive civil society network promoting and protecting the right to freedom of religion or belief for everyone in Myanmar.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>
          <li><a class="u-link u-link--fade" href="about.html">About Us</a></li>
          <li><a class="u-link u-link--fade" href="insights.html">Insights</a></li>
          <li><a class="u-link u-link--fade" href="learning.html">FoRB Learning</a></li>
          <li><a class="u-link u-link--fade" href="contact.html">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4>Our work</h4>
        <ul>
          <li><a class="u-link u-link--fade" href="about.html#data">FoRB data</a></li>
          <li><a class="u-link u-link--fade" href="about.html#what-we-do">Documentation</a></li>
          <li><a class="u-link u-link--fade" href="about.html#what-we-do">Advocacy</a></li>
          <li><a class="u-link u-link--fade" href="about.html#network">The Network</a></li>
          <li><a class="u-link u-link--fade" href="#newsletter">Newsletter</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Myanmar FoRB Network. All rights reserved.</span>
      <span>Freedom is our faith.</span>
    </div>
  </div>
</footer>

<button class="to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button>

'''

PAGES = {
  "index.html":    ("Myanmar FoRB Network — Freedom of Religion or Belief in Myanmar",
                    "Myanmar FoRB Network documents violations, advocates and builds solidarity to protect freedom of religion or belief for everyone in Myanmar.", "candles.jpg", True),
  "about.html":    ("About Us — Myanmar FoRB Network",
                    "An independent, inclusive civil society network established in 2021 to promote and protect freedom of religion or belief in Myanmar.", "community-walk.jpg", True),
  "insights.html": ("Insights — Myanmar FoRB Network",
                    "Reports, briefings, statements and analysis on freedom of religion or belief in Myanmar.", "documents.jpg", False),
  "learning.html": ("FoRB Learning — Myanmar FoRB Network",
                    "Learn what freedom of religion or belief means, the international standards that protect it, and how violations are documented.", "writing.jpg", False),
  "contact.html":  ("Contact Us — Myanmar FoRB Network",
                    "Get in touch with the Myanmar FoRB Network.", "solidarity-hands.jpg", False),
}

for page, (title, desc, og, data) in PAGES.items():
    body = open(os.path.join(GEN, "pages", page), encoding="utf-8").read()
    body = body.replace("{{ARROW}}", ARROW).replace("{{HERO_LOGO}}", HERO_LOGO)
    scripts = ('<script src="' + ver("assets/js/data.js") + '"></script>\n' if data else '') + '<script src="' + ver("assets/js/main.js") + '"></script>\n</body>\n</html>\n'
    html = head(title, desc, og) + header(page) + '\n<main id="main">\n' + body + '\n</main>\n' + FOOTER + scripts
    open(os.path.join(OUT, page), "w", encoding="utf-8").write(html)
    print("wrote", page, len(html))
