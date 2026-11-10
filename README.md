# cloudlm-web

Static website for **Cloud Learn & Media** — [cloudlm.in](https://cloudlm.in).

No build step: plain HTML, one stylesheet and one small script.

```
index.html        Home
about.html        About us
businesses.html   Cloud Pathshala · The Cloud Pulse · The Cloud Career
contact.html      Contact form (opens the visitor's email app) + FAQ
privacy.html      Privacy policy
404.html          Not-found page (uses root-relative links)
assets/style.css  Design system (tokens at the top of the file)
assets/main.js    Mobile menu, scroll reveal, count-up stats, form validation
robots.txt, sitemap.xml
```

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (Hostinger)

Upload every file and folder above into `public_html/`, keeping the structure.
To serve the custom 404 page, add this line to `public_html/.htaccess`:

```
ErrorDocument 404 /404.html
```

After changing `assets/style.css` or `assets/main.js`, bump the `?v=` number
in the `<link>`/`<script>` tags so visitors get the new version.
