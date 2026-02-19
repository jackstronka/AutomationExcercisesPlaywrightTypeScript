# GitHub Pages

This project is **not** currently set up for GitHub Pages.

## What GitHub Pages could be used for

- **Project documentation** – serve `docs/` or a generated site (e.g. from MkDocs, Docusaurus, or plain Markdown with a theme).
- **Playwright HTML report** – optionally publish the latest test report (e.g. from `main`) so the team can view it without downloading artifacts.

## How to enable GitHub Pages

1. In the repo: **Settings → Pages**.
2. **Source**: choose one of:
   - **Deploy from a branch** – e.g. branch `main`, folder `/ (root)` or `/docs` (if you use Jekyll and put a site in `docs/`), or branch `gh-pages` and folder `/ (root)`.
   - **GitHub Actions** – add a workflow that builds and uploads the site (e.g. [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact) and [actions/deploy-pages](https://github.com/actions/deploy-pages)).
3. After saving, the site is available at `https://<username>.github.io/<repo-name>/`.

## If you only want to publish docs

- Put a simple `index.html` in a branch (e.g. `gh-pages`) or in `/docs` and enable Pages from that branch/folder.
- Or add a step in CI that builds a static site from `docs/*.md` and deploys it via the GitHub Actions method above.

No changes to the current Playwright test setup are required for Pages; Pages is independent of how tests run.
