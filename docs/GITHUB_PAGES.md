# GitHub Pages – Test report

The Playwright HTML report is **deployed to GitHub Pages** after each run (push or PR to `main`/`master`). You get a stable URL to view the latest report without downloading artifacts.

## Report URL

**https://jackstronka.github.io/AutomationExcercisesPlaywrightTypeScript/**

(If the repo is under a different user/org, the URL is `https://<username>.github.io/AutomationExcercisesPlaywrightTypeScript/` or as shown in **Settings → Pages**.)

## One-time setup

1. In the repo: **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Save. No need to create a branch or folder.

After the next run of the “Playwright Tests” workflow, the report will be available at the URL above.

## How it works

- The **test** job runs Playwright, generates the HTML report in `playwright-report/`, and uploads it as a normal artifact (downloadable from the run).
- The **deploy-report** job runs after the test job (even when tests fail), uploads that report as a Pages artifact, and deploys it with `actions/deploy-pages`.
- Each push/PR to `main` or `master` overwrites the Pages site with the latest report.

## Optional: publish other content

- To publish **project docs** (e.g. from `docs/` or a static site generator), you can add another workflow or job that builds the site and uses `upload-pages-artifact` + `deploy-pages`. Right now only the Playwright report is deployed.
