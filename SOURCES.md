# Everyone Who Ever Lived — data tables and sources

Companion to `index.html`. Every table the page uses is listed here with the values, the source, and how far it was checked at build time (2026-09-07). The JS tables live in the `<script>` block of `index.html` under the same names; this file explains where the numbers come from and which ones are guesses.

Verification marks: **F** = fetched from the source during the build (OWID/HYDE, PRB, Riley/UN, Maddison via Wikipedia); **K** = taken from the literature from memory and cross-checked against at least one fetched anchor; **H** = hand-set assumption, documented here and in the page's "under the hood" panel.

## 1. World population path (`POP`, millions) — F/H

| Year | Millions | Source |
|---|---|---|
| 190,000 BCE | 0.01 | H — founding population; PRB starts from 2 people, which makes prehistory's mean population artificially small |
| 50,000 BCE | 2 | PRB 2022 (F) |
| 10,000 BCE | 4.5 | HYDE 3.3 via OWID (F) |
| 5000 / 3000 / 2000 / 1000 BCE | 19.2 / 44.6 / 72.7 / 110.5 | HYDE 3.3 (F) |
| 1 CE / 500 / 1000 / 1500 / 1600 / 1700 | 232.3 / 253.4 / 323.5 / 503.1 / 516.1 / 595.5 | HYDE 3.3 (F) |
| 1800 / 1850 / 1900 / 1950 | 983.1 / 1,275.6 / 1,627.3 / 2,493.1 | HYDE 3.3 (F) |
| 1960 … 2023 | 3,019 / 3,695 / 4,444 / 5,316 / 6,171.7 / 6,985.6 / 7,887 / 8,091.7 | UN WPP 2024 via OWID (F for 2000 and 2023; K for the decades between) |
| 2027 | 8,370 | H — UN projection extrapolated, needed as the closing bin edge |

Population is interpolated exponentially between nodes. Note the gap to the PRB path: PRB uses 300 million at 1 CE and 450 million at 1200, HYDE 232 and about 360. That gap, not the birth rates, is why the page's total under the PRB schedule is about 105 billion rather than 117.

## 2. Crude birth rate schedules (`CBR`, births per 1,000 per year) — F/H

| Period | PRB schedule (default) | Moderate schedule (toggle) |
|---|---|---|
| before 1 CE | 80 (ramped to 60 between 200 BCE and 200 CE) | 42 |
| 1 – 1500 | 60 | 40 |
| 1500 – 1750 | 60 | 38 |
| 1750 – 1850 | 50 | 38 → 37 |
| 1850 – 1900 | 40 | 37 |
| 1900 – 1950 | 38 → 34 → 37 | 37 → 34 → 37 |
| 1950 – 2027 | UN period averages: 37, 35.5, 35.2, 33.7, 31.4, 28.5, 27.9, 27.3, 24.4, 22.4, 21.0, 20.5, 19.7, 18.2, 16.8, 16.0 | same |

PRB values are from Kaneda & Haub, "How Many People Have Ever Lived on Earth?" (PRB, Nov 2022), table fetched at build (F). The moderate schedule (H) follows the stationary-population identity CBR ≈ 1/e0 with e0 ≈ 25–30 (Gurven & Kaplan 2007; Volk & Atkinson 2013). Resulting totals: PRB 105.4 bn births (10.8% in 1926–2026, 45.2% before year 1, 13.4% before 10,000 BCE); moderate 67.7 bn (16.9%, 35.5%, 10.6%). Births 1950–2020 come out at 8.56 bn against 8.8 bn implied by the PRB/UN table (−3%).

## 3. Regional populations (`REGPOP`, millions) — F/K/H

Ten regions: East Asia, South Asia, Southeast Asia, West & Central Asia, Europe (incl. European Russia), North Africa (incl. Sudan, as the UN does), Sub-Saharan Africa, North America (USA + Canada), Latin America & Caribbean, Oceania.

- **1 CE – 1950:** HYDE 3.3 continental totals (F: Asia, Europe, Africa, "North America" incl. Mexico/Central America/Caribbean, South America, Oceania) split by hand-set shares (K, from Maddison 2007/2020 and McEvedy & Jones 1978). Asia split East/South/SE/West-Central: 1 CE 38/38/6/18, 1000 37/40/8/15, 1500 43/40/8/9, 1700 45/41/7.5/6.5, 1800 57/30/7/6, 1900 52/32/9/7. Africa North/Sub-Saharan: 1 CE 45/55, 1000 30/70, 1500 20/80, 1800 16/84, 1900 16/84. HYDE "North America" → USA+Canada share: 10% to 1500, 40% in 1600, 18% in 1700, 42% in 1800, 64% in 1850, 78% in 1900; the remainder joins South America as Latin America & Caribbean.
- **1950, 2000, 2023:** UN WPP 2024 country sums (K).
- **Before 1000 BCE:** H. HYDE's continental split is unusable there (it puts half of humanity in the Americas at 10,000 BCE), so shares follow the dispersal record (Bae, Douka & Petraglia 2017) and McEvedy & Jones: Africa only until 70,000 BCE; West and South Asia from 70,000; Europe, East and Southeast Asia from 45,000; Oceania from 50,000; the Americas from 15,000 BCE. A region has zero weight before its first node.
- Interpolation is log-linear, so the 1500→1600 collapse of the Americas is proportional.

## 4. Regional birth-rate multipliers (`CBRMULT`) — K

Ratio of the region's crude birth rate to the world's; 1.0 before 1800. 2000 anchors (UN WPP): Sub-Saharan Africa 1.9 (≈41 per 1,000), South Asia 1.28 (≈27), Europe 0.48 (≈10), East Asia 0.6, Latin America 1.07, North America 0.65. 2023: SSA 2.06, East Asia 0.4. Without these the "last 100 years" mode would give Africa its population share (~11%) instead of its birth share (~20%).

## 5. Forager shares (`FORAGER`) — H/K

Share of a region's people living by foraging rather than farming or herding; 100% everywhere before 10,000 BCE, then per region: e.g. Fertile Crescent 50% by 8000 BCE and 15% by 6000 BCE; Europe 30% by 5000 BCE; Sub-Saharan Africa 45% at 1 CE, 12% in 1500; the Americas 85% (north) / 35% (south) at 1 CE; Australia-dominated Oceania 55% at 1 CE, 30% in 1788. Based on the archaeological spread of agriculture (Bellwood 2005; Diamond 1997) and ethnographic atlases; rough by construction.

## 6. Life expectancy at birth (`E0`, years) — F/K/H

Pre-1770 hand nodes: 30 for foragers (Gurven & Kaplan 2007, modal 30–31); 26–28 for agrarian antiquity and the Middle Ages; 32–33 for early modern Europe (Wrigley & Schofield). From 1770: Riley (2005) regional series and UN WPP via OWID (F): e.g. 1770 Africa 26.4, Asia 27.5, Europe 34.3, Americas 34.8; 1900 Europe 42.7, Asia 28.0, Americas 41.0, Oceania 47.6; 1950 Europe 62.0, Asia 42.0, Africa 37.2, Latin America 48.7, Northern America 68.1; 2023 Europe 79.1, Asia 74.6, Africa 63.8, Latin America 75.7, Northern America 79.6, World 73.2. Sub-regional values (e.g. South Asia 24 in 1900, East Asia 43 in 1950) are K from country data.

## 7. Child mortality (`U5_OVR` and the derived curve) — F/K

Where measured (1900+ for Europe, North America, Oceania, Latin America; 1950+ everywhere): UN IGME and OWID series (K), e.g. 1950 Sub-Saharan Africa 35%, South Asia 30%, Europe 10%, Northern America 4%; 2023 SSA 7%, South Asia 3.5%, Europe 0.5%. Elsewhere under-5 mortality is derived from life expectancy with `u5 = 0.5·((85 − e0)/65)^1.6` (e0 25 → 44%, 50 → 19%, 65 → 7.6%, 80 → 0.8%), a fit against Coale–Demeny West tables that reproduces Volk & Atkinson's pre-modern average of 46% at e0 ≈ 24. Infant mortality is 60–75% of under-5.

## 8. Survival model — K

Per (region, year, sex): l(1) = 1 − q0, geometric decline to l(5) = 1 − u5, then a Gompertz–Makeham hazard `A + B·e^(0.09x)` with the Makeham term tied to e0 (`A = max(0.0006, 0.012·(60 − e0)/35)`) and B found by bisection so the table's mean equals the sex-specific e0 (male −0.51·Δ, female +0.49·Δ; Δ = 2.5 years before 1926, 5 after). Women carry a maternal hazard `MMR·f(x)·TFR/6` with a natural fertility schedule (0.12 at 15–19, 0.30 at 20–29, 0.25 at 30–34, 0.18 at 35–39, 0.08 at 40–44); MMR 1.2% per birth before 1800 (Loudon 1992), falling by region to 0.01–0.5% today (WHO). Adult male foragers carry an extra 0.4%/year violence hazard at ages 15–49 (Bowles 2009; Gurven & Kaplan 2007). Causes of death are attributed by hazard component where one applies (childbirth, violence) and otherwise drawn from era- and age-banded lists; crowd diseases are excluded for foragers and before 1000 BCE.

## 9. Quality-of-life indicators (`IND`, `IND_OVR`) — K/F

| Indicator | Anchors used |
|---|---|
| GDP per head (2011 $) | Maddison 2007 regional table in 1990 $ (F, via Wikipedia's reproduction): W. Europe 576 (1 CE), 771 (1500), 1,202 (1820), 3,457 (1913), 4,578 (1950); China 450 / 600 / 600 / 552 / 448; India 450 / 550 / 533 / 673 / 619; Africa 472 / 414 / 420 / 637 / 890; World 467 / 566 / 667 / 1,526 / 2,113. Rebased ×1.72 to 2011 $ and ×1.45 again to today's money for the "$ a day" tile. 2000–2023 from the Maddison Project Database 2023 (K). |
| Literacy | Buringh & van Zanden 2009 for Europe 1500–1800 (10% → 50%); OWID: world 12% in 1820, ~20% in 1870–1900 (F), 36% in 1950, 87% in 2020; regional 1950/2020 from UNESCO (K). Classical Rome ~10% (Harris 1989). |
| Urban share | Bairoch 1988 (pre-modern 5–8%; Roman Italy and Song China ~10–25%); UN WUP 1950 and 2020 by region (K). |
| Unfree share | Roman Italy ~30%, empire ~10% (Scheidel 2011); medieval European serfdom 30–50% at its peak; Russia 1800 ~45% serfs; Caribbean 1750 ~85% enslaved, Brazil ~35%, US colonies ~20%; Joseon Korea ~30% nobi; modern 0.6% (Walk Free 2023). Era defaults 1–12%, regional overrides as listed in the JS. |
| Workers in farming | Pre-1800 75–90% (Allen 2000; Maddison); 1900 Europe ~45%, USA ~40%; 1950 world ~64%; 2019 world 26%, SSA 53%, South Asia 42%, Europe 4.5%, North America 1.5% (ILO via OWID, K). |
| Adult male height | Koepke & Baten 2005 (Europe 168–172 cm, medieval peak); NCD-RisC 2016 for cohorts born 1896 vs 1996 (Europe 168 → 178, China 161 → 172, India 162 → 165, USA 171 → 177, SSA 166 → 168). |
| Fertility, marriage | Pre-modern TFR 5.5–6 (Kaplan et al. 2000 for foragers); UN WPP 1950 and 2020 by region; marriage ages from Hajnal 1965 (NW Europe 24–27), Dyson & Moore 1983 (South Asia 13–16), UN World Marriage Data. |

"World today" comparison row (2023): e0 73.2, under-5 3.7%, literacy 87%, urban 57%, GDP per head ≈ $17,000 (2011 $), unfree 0.6%, farming 26%, height 171 cm.

## 10. Occupations (`OCC`) — K

Thirty-two lists keyed by era class × region group × sex, with rough shares: foragers (Marlowe 2007; Murdock's Ethnographic Atlas); agrarian eras (IISG Global Collaboratory on the History of Labour Relations, 1500–2000 benchmarks; Allen 2000; Boserup 1970 for women's farm work); industrial and twentieth-century lists from ILO and national census structures (UK 1851, USA 1900, India 1901/1951, Brazil 1950, China 1982). Shares are order-of-magnitude, not statistics.

## 11. Polities (`POLITY`) and events (`EVENTS`) — K

About 150 polity rows (region, start year, weighted labels) and 63 events with region masks. Standard reference chronology (Cambridge and Oxford histories); population weights among composite slices are approximate.

## Verification performed

- `AHE.selfCheck(20000, mode, schedule)` passes for all three modes and both schedules: era shares match the prefix sums, region shares match quadrature, under-5 deaths match the cells' rates, mean age at death matches the sex-specific e0 within tolerance, male share 51.2%, no year outside the mode range, seeds reproduce.
- Totals: PRB 105.4 bn / moderate 67.7 bn; 1950–2020 births within 3% of the UN.
- Font-size floor of 12 px and the no-italics rule verified by script in the default theme.

## 12. Version 2 additions (2026-09-07, Ossuary design)

- **Names** (`NAMES`): common attested given names by region and period, with pools for Japan, Korea, Muslim South Asia, tribal and Byzantine Europe, pre-conquest Mesoamerica and the Andes, and Polynesia. Peoples whose names were never written down (before 3300 BCE; Native North America before contact; foragers of Africa, the Americas and Oceania before 1500; Aboriginal Australia) are left unnamed on purpose. K.
- **Religion** (`RELIGION`): weighted labels by region and period (Pew Research Center, World Religion Database summaries, standard histories). K.
- **Diet and dwellings** (`DIET`, `DWELLING`): typical staples and houses by region and era class (Cambridge World History of Food; Oliver, Encyclopedia of Vernacular Architecture of the World). K.
- **Cities** (`CITIES`): the two to four largest cities of each region and era class (Chandler; Reba, Reitsma & Seto 2016), used for urban lives. K.
- **Events** now carry a type (event, plague, famine, eruption) and add famines and eruptions: the 2200 BCE drought, Thera, 536, Samalas 1257, the Great Famine of 1315, Huaynaputina 1600, Laki 1783, Tambora 1815, Krakatoa 1883, Pinatubo 1991, and famines from Bengal 1770 to Ethiopia 1984 (Sigl et al. 2015; Alfani & O Grada 2017; O Grada, Famine: A Short History). K.
- **Countries after 1800**: colonial-era slices for Africa, North Africa, Southeast Asia and British India; existing post-1947 country slices elsewhere. K.
- **Map** (`MAP`): a deliberately coarse engraved chart, ten region polygons hand-set in longitude and latitude; equirectangular projection. H.
- **Fertility slider**: the crude birth rate at each node is `moderate + s/100 x (PRB - moderate)`; totals range from 67.7 to 105.4 billion. Links carry the slider value.
- **Percentiles** ("Compare with your own life"): births-weighted quadrature over every bin, sub-interval, region and forager/farmer split (about 6,500 cells) of life expectancy, under-5 mortality, literacy, urban share, income and unfree share; a birth's percentile is the weighted share of cells with worse conditions.
- **Self-check** re-run for the slider at 0, 50 and 100: all pass.
