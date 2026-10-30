# Southeast Diving Services

Website for Southeast Diving Services (S.E.D.), underwater problem solvers serving Miami-Dade, Broward, and the Palm Beaches.

- **Phone (24/7):** (954) 650-6931
- **Email:** southeastdiving@gmail.com
- **Address:** 2601 SW 31st St., Unit #301, Fort Lauderdale, FL 33312
- **Office hours:** Mon - Fri, 9am - 3pm

## Site

Plain static HTML, so it can be hosted on GitHub Pages with no build step.

```
index.html                 homepage
about-us/                  About Us
services/                  Services overview, plus one folder per service page
port-services/             Port Services
contact-us/                Contact Us
css/style.css              styles shared by every page
images/                    photos, logo, and icons
video/hero-waves.mp4       looping background video for the homepage banner
```

Each page lives in its own folder as `index.html`, so URLs look like `/about-us/`. The header and footer are repeated on every page, so a change to the menu, phone number, or address needs to be made in each file.

To publish: **Settings → Pages → Deploy from branch → `main` / root**.

### Editing tips

- Replace an image by uploading a new file with the same name into `images/`.
- Keep photos under ~300 KB (about 1600px wide) so the page stays fast.
- The contact form (`js/contact.js`) sends through [Formspree](https://formspree.io) once `FORMSPREE_ID` at the top of that file is filled in. While it's empty, the form opens the visitor's email app with the message pre-filled instead, because GitHub Pages can't process forms on its own.
