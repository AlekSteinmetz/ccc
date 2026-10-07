# Coral Construction Company — website

A fast, modern, fully static website for **Coral Construction Company** (Marathon, Florida Keys — family owned since 1968).
Plain HTML, CSS and JavaScript: no frameworks, no build step, no dependencies. It can be hosted anywhere that serves
static files, including **GitHub Pages**.

## Preview locally

From this folder, run:

```bash
./preview.sh
```

That starts a local server at <http://localhost:8000> and opens it in your browser (Ctrl+C to stop).
Use `./preview.sh 4000` for a different port. Under the hood it's just:

```bash
python3 -m http.server 8000
```

> Opening `index.html` directly from Finder mostly works too, but folder links like `marine/` behave best through the
> local server, so use `preview.sh`.

## Deploy with GitHub Pages

1. Create a new repository on GitHub and push the contents of this folder to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Coral Construction website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After a minute the site is live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

Every push to `main` redeploys automatically.

### Use the coralconstructioncompany.com domain

1. In **Settings → Pages → Custom domain**, enter `coralconstructioncompany.com` and save (GitHub adds a `CNAME` file).
2. At your domain registrar, point DNS to GitHub Pages:
   - `A` records for the apex domain: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `YOUR-USERNAME.github.io`
3. Once DNS resolves, tick **Enforce HTTPS**.

The site uses relative links, so it works both on the `github.io` preview address and on the custom domain.
The one exception is `404.html`, which uses root-relative links and is styled correctly only at a domain root
(the custom domain, or a `USERNAME.github.io` user site).

The same folder also deploys as-is to Netlify, Cloudflare Pages or Vercel (no build command, publish directory = root).

## Contact form

The form on `/contact/` works with zero setup: on submit it opens the visitor's email app with a pre-filled message to
`office@coralconstructioncompany.com`.

To receive submissions directly instead (recommended), create a free form endpoint with a service such as
[Formspree](https://formspree.io) and paste its URL into the `data-endpoint` attribute in `contact/index.html`:

```html
<form data-contact-form data-endpoint="https://formspree.io/f/your-id" ...>
```

## Project structure

```
index.html                         Home
marine/                            Marine construction (marinas, docks, seawalls, spall & dock repair)
residential-commercial/            New construction, remodeling, foundations, stairs, ADA
government/                        Public works & government contracting
government/capability-statement/   Printable capability statement (Print → Save as PDF)
portfolio/                         Filterable portfolio of every project
history/                           Our story & timeline
contact/                           Contact form, details, map
404.html                           Not-found page
assets/css/styles.css              All styles (design tokens at the top)
assets/js/main.js                  Menu, lightbox, before/after sliders, filters, form
assets/img/work/                   Project photos (WebP, full size) — sm/ holds thumbnails
marine/dock/ … (etc.)              Redirects from the old site's URLs to the new sections
```

## Editing content

- **Text**: edit the HTML files directly; each page is self-contained.
- **Add a photo to a gallery**: convert it to WebP (e.g. `cwebp -q 74 -resize 1800 0 photo.jpg -o assets/img/work/my-photo.webp`,
  plus a ~900px copy in `assets/img/work/sm/`), then copy an existing `<a class="g-item" …>` block in that gallery and
  update the file names and caption.
- **Colors & fonts**: change the CSS custom properties at the top of `assets/css/styles.css`.
- **Header & footer** are repeated on each page; if you change a nav link, update it on every page (search & replace works well).

## Before launch — please verify

Some copy goes beyond what the old site stated. Please confirm these with the company before publishing:

- **Public works claims** (`government/`): bonding capacity, certified payroll, MOT capability, FDOT-spec work, and the
  NAICS codes listed. Add state license number(s) and, if registered, SAM.gov UEI / CAGE codes to the capability
  statement (there's a commented placeholder in `government/capability-statement/index.html`).
- **Licensing**: "Licensed & insured" appears in the footer and elsewhere. Consider adding the license number.
- **Service area**: the site says the company serves the Keys from Key West to Key Largo.
- **Project locations / mile markers** on project cards (e.g. Coconut Cay MM 50.5, Turtle Hospital MM 48.5).
- **Family captions**: the family photo is captioned "the Steinmetz & Lyons family" (from the original file name).

## Design notes

The palette and motifs come from Florida Keys history: deep channel blue and backcountry-flats teal; *keystone* sand
(the fossil coral rock the Keys are built on); living coral; and the green of the Overseas Highway's mile-marker signs.
The arched section edges echo the concrete arches of Flagler's Overseas Railroad viaducts, project locations are tagged
with mile-marker badges, and dark sections carry a nautical-chart contour texture. Typefaces are Fraunces (headings) and
Overpass — a typeface descended from the Highway Gothic lettering on U.S. road signs.
