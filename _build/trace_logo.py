import sys, math, cv2, numpy as np
src, out = sys.argv[1], sys.argv[2]
S = 6
im = cv2.imread(src, cv2.IMREAD_UNCHANGED)
im = cv2.resize(im, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC)
a = im[:, :, 3]
hsv = cv2.cvtColor(im[:, :, :3], cv2.COLOR_BGR2HSV)
h = hsv[:, :, 0].astype(int)
on = a > 120
groups = [  # name, token, hue test
  ("purple", "var(--c-purple)", (h >= 121) & (h <= 165)),
  ("blue",   "var(--c-blue)",   (h >= 96) & (h <= 120)),
  ("green",  "var(--c-green)",  (h >= 55) & (h <= 95)),
  ("yellow", "var(--c-yellow)", (h >= 21) & (h <= 40)),
  ("orange", "var(--c-orange)", (h >= 12) & (h <= 20)),
  ("red",    "var(--c-red)",    (h <= 11) | (h >= 166)),
]
ys, xs = np.nonzero(on)
cx, cy = xs.mean(), ys.mean()
# use bbox centre for rotation (symmetric mark)
cx = (xs.min() + xs.max()) / 2; cy = (ys.min() + ys.max()) / 2
R = max(xs.max() - cx, cx - xs.min(), ys.max() - cy, cy - ys.min()) + 4 * S
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
figs = []
for name, tok, test in groups:
    m = ((on & test) * 255).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k)
    m = cv2.GaussianBlur(m, (21, 21), 0); m = ((m > 127) * 255).astype(np.uint8)
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cs = [c for c in cs if cv2.contourArea(c) > 400]
    d = ""
    my, mx = np.nonzero(m)
    ang = math.degrees(math.atan2(my.mean() - cy, mx.mean() - cx))
    for c in cs:
        c = c[:, 0, :].astype(float)
        n = len(c); w = 41
        g = np.exp(-np.linspace(-2.5, 2.5, w) ** 2); g /= g.sum()
        ext = np.vstack([c[-(w // 2):], c, c[: w // 2]])
        sm = np.stack([np.convolve(ext[:, 0], g, "valid"), np.convolve(ext[:, 1], g, "valid")], 1)
        c = cv2.approxPolyDP(sm.astype(np.float32).reshape(-1, 1, 2), 0.9, True)[:, 0, :]
        pts = [((x - cx) / S, (y - cy) / S) for x, y in c]
        d += "M" + " ".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z"
    figs.append((name, tok, ang, d, len(cs)))
    print(name, len(cs), round(ang))
r = R / S
svg = f'<svg class="lg" viewBox="{-r:.0f} {-r:.0f} {2*r:.0f} {2*r:.0f}" aria-hidden="true" focusable="false">' + "".join(
    f'<g class="lg-fig" style="--c:{tok};--a:{ang:.0f}deg;--i:{i}"><path fill="var(--c)" d="{d}"/></g>' for i, (n, tok, ang, d, _) in enumerate(figs)) + "</svg>"
open(out, "w").write(svg)
print(len(svg), "viewbox r", round(r))
