# Everyone Who Ever Lived

One life at random from everyone who was ever born.

The page draws a single human being from all the births there have ever been, weighted by how many people were actually born in each age and place, and tells you what that life most likely looked like: the odds of the draw, the name, the faith, the work, the food, the roof, the diseases and famines of the time, and how the life ended. It can also deal a hundred lives at once, rank the conditions of your own birth against everyone ever born, and print a certificate.

**Live page:** https://everyone-who-ever-lived.pages.dev/

Every life is computed in one file (`site/index.html`), and nothing about the lives you draw is sent anywhere. The same link always reproduces the same life. The site keeps two anonymous totals, visits and lives drawn, shown at the bottom of the page, and cookieless page-view statistics.

## Layout

- `site/`: the page as published on Cloudflare Pages.
- `functions/api/count.js` and `wrangler.toml`: the counter, a Pages function over one row in a D1 table.
- `index.html` at the root: the old GitHub Pages address, which now forwards to the new one and keeps the `#` so old links open the same life.
- `publish.py`: copies the page from its working copy and deploys it with wrangler.

## Model and sources

The demographic model, its tables, the assumptions and every source are documented in [SOURCES.md](SOURCES.md). The one assumption that moves everything, the birth rate of the deep past, is exposed as a slider on the page. Open the browser console and run `AHE.selfCheck()` to compare 20,000 draws against the model.

Inspired by [anyhumanever.com](https://anyhumanever.com/), which draws its lives from a much larger server-side model.
