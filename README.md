# Indonesia in Numbers

An original national statistics portal for Indonesia, hand-written in vanilla HTML, CSS and
JavaScript — no libraries, no build step, no network requests. Open `app/index.html` in a desktop
browser or on a phone and the whole site works offline from its own files.

**Entry for the make.fun bounty:** [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

![competition](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)
![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/srakart28/indonesia-in-numbers/rank.svg)
![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/srakart28/indonesia-in-numbers/reward.svg)

## The sections

- **Overview** — nine headline indicator cards (population, GDP, GDP per capita, growth, inflation,
  unemployment, poverty rate, life expectancy, literacy), a population trend chart across seven
  censuses, and the country at a glance.
- **Demographics** — a canvas population pyramid for 2024 by five-year age band and sex, age-structure
  summary cards (children, working age, older people, median age, urban share, density), the census
  trend line, and a reading of what the pyramid's shape means.
- **Economy** — a growth/inflation chart with a working series toggle (2015–2024, including the 2020
  pandemic contraction), a sector-share donut of GDP, and 2024 trade-in-goods cards.
- **Provinces** — all 34 provinces as constituted at the 2020 census with capital, population and
  share of the national total, in a table with live search and click-to-sort column headings.
- **Society** — school participation by level, schooling and health indicator cards, and the falling
  child-stunting trend, with a short reading of the numbers.

Every chart is drawn by the site's own canvas code (`app/charts.js`); every control — navigation,
the economy series toggle, province search and sorting — works. The layout folds to a single column
on a phone.

## Data and sources

Every figure on the site is labelled in place with its publisher and year. The figures are the widely
published official values, held in one auditable file (`app/data.js`):

- **BPS (Statistics Indonesia)** — 2024 mid-year population estimate and 2024 national indicators,
  Population Censuses 1971–2020 (including all province populations), national accounts and trade.
- **World Bank** World Development Indicators — GDP and GDP per capita (2024), life expectancy (2023),
  literacy (2020), urban share (2024), tertiary enrolment (2023), infant mortality (2023).
- **SSGI** National Nutrition Survey — child stunting 2018–2023; **BPJS Kesehatan** — national health
  insurance coverage (2024); UN population estimates for the 2024 age structure (shares rounded).

Indonesia in Numbers is an independent demonstration portal; it is not affiliated with BPS or the
Government of Indonesia.

## Layout of this entry

- `main.ts` — the hand-in program (Node 22): copies `app/` and `screenshots/` to the output and
  writes `dossier.json` with the vendored make.fun library.
- `app/` — the site itself: `index.html` (shell), `main.js` (hash router), `views.js` (the five
  sections), `charts.js` (canvas charts), `data.js` (every figure, with its source), `style.css`.
- `screenshots/` — four renders of the running site: overview, economy and provinces at 1280×800,
  and the overview at a phone's 390×844 (`shots.json` lists which view each one shows).
- `vendor/makefun-frontend.ts` — the make.fun dossier library, vendored unchanged.
- `serve.ts` — a tiny local server for trying the site: `node serve.ts`, then open
  http://localhost:8080.

## Licence

MIT — see `LICENSE`.
