# Everyone Who Ever Lived

One life at random from everyone who was ever born.

The page draws a single human being from all the births there have ever been, weighted by how many people were actually born in each age and place, and tells you what that life most likely looked like: the odds of the draw, the name, the faith, the work, the food, the roof, the diseases and famines of the time, and how the life ended. It can also deal a hundred lives at once, rank the conditions of your own birth against everyone ever born, and print a certificate.

**Live page:** https://drbcaldeira.github.io/everyone-who-ever-lived/

Everything runs in one file. Nothing is fetched except the fonts, and nothing you do is sent anywhere. The same link always reproduces the same life.

## Model and sources

The demographic model, its tables, the assumptions and every source are documented in [SOURCES.md](SOURCES.md). The one assumption that moves everything, the birth rate of the deep past, is exposed as a slider on the page. Open the browser console and run `AHE.selfCheck()` to compare 20,000 draws against the model.

Inspired by [anyhumanever.com](https://anyhumanever.com/), which draws its lives from a much larger server-side model.
