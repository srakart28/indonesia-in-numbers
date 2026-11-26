// Indonesia in Numbers — entry program (Node 22, standard library only).
//
// The site itself is this directory's app/ folder: plain static files a browser opens at
// app/index.html (ES modules, CSS, no build step), and nothing it runs, styles or shows loads
// over the network. This program hands the site in, and before it does, it proves the site is
// whole. Three groups of checks run against the real files, and any failure stops the hand-in
// with a non-zero exit and one line per problem:
//
//   1. Routes and links — every "#/…" link in app/index.html and every view named in
//      shots.json resolves to a route in app/main.js, and every route's page exists in the
//      pages table in app/views.js. Every file app/index.html loads, and every relative
//      module import in app/*.js, names a file that is really there.
//   2. Figures — app/data.js is imported and audited: each headline indicator and society
//      fact carries a publisher and a year in its note, each summary note carries a year,
//      the sector shares sum to 100, the province table is complete and its populations
//      add up to the census total the trend series prints, and every series is in order.
//   3. Screenshots and caps — screenshots/ holds 3 or 4 images, each a real PNG or JPEG
//      under the scorer's 256 KiB cap, and app/ sits inside the scorer's file and byte caps.
//
// A clean run copies app/ and screenshots/ beside /output (MAKEFUN_OUTPUT_DIR stands in for
// it outside the grader's container), writes /output/dossier.json with the vendored make.fun
// library — byte for byte what the scorer's own copy writes, so vendor/makefun-frontend.ts is
// never touched — and finally writes /output/manifest.json, this program's own build record:
// the routes, the files and their sizes, the figure counts and how many checks passed.
// The manifest is written after the dossier on purpose: the dossier describes the site, and
// an extra file inside it would change its bytes.
//
// Serve the site locally with `node serve.ts`, then open http://localhost:8080.

import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';
import * as data from './app/data.js';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(here, 'app');
const shotsDir = join(here, 'screenshots');

const problems: string[] = [];
const passed: Record<string, number> = {};
const check = (group: string, ok: boolean, message: string) => {
  if (ok) passed[group] = (passed[group] ?? 0) + 1;
  else problems.push(`${group}: ${message}`);
};

// --- small file helpers -------------------------------------------------------

const readText = (path: string) => readFileSync(path, 'utf8');

function walk(dir: string, base = dir): { path: string; bytes: number }[] {
  const files: { path: string; bytes: number }[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, base));
    else files.push({ path: full.slice(base.length + 1), bytes: statSync(full).size });
  }
  return files.sort((a, b) => (a.path < b.path ? -1 : 1));
}

const matches = (text: string, pattern: RegExp) => [...text.matchAll(pattern)].map((m) => m[1]);

// --- 1. routes and links ------------------------------------------------------

const indexHtml = readText(join(appDir, 'index.html'));
const mainJs = readText(join(appDir, 'main.js'));
const viewsJs = readText(join(appDir, 'views.js'));

const routesBlock = mainJs.match(/const routes = \{([\s\S]*?)\};/)?.[1] ?? '';
const routePaths = matches(routesBlock, /'([^']+)'\s*:/g);
const routePages = matches(routesBlock, /:\s*'([^']+)'/g);
const pagesBlock = viewsJs.match(/export const pages = \{([\s\S]*?)\};/)?.[1] ?? '';
const pageNames = matches(pagesBlock, /^\s+(\w+):/gm);

check('routes', routePaths.length >= 2, `expected a route table in app/main.js, found ${routePaths.length} routes`);
check('routes', routePaths.length === routePages.length, 'route table keys and page names do not pair up in app/main.js');
for (const page of routePages) {
  check('routes', pageNames.includes(page), `route page "${page}" has no entry in the pages table in app/views.js`);
}

// Every reference app/index.html makes: "#/…" links must resolve to a route, the rest must
// be files under app/. The nav's data-route names must be pages the router can show.
const refs = matches(indexHtml, /(?:src|href)="([^"]+)"/g);
for (const ref of refs) {
  if (ref.startsWith('#')) {
    check('links', routePaths.includes(ref.slice(1)), `index.html links to ${ref}, which is not a route in app/main.js`);
  } else if (/^(?:https?:)?\/\//.test(ref)) {
    check('links', false, `index.html loads ${ref} over the network; the site must run from its own files`);
  } else {
    check('links', existsSync(join(appDir, ref)), `index.html loads ${ref}, which is missing from app/`);
  }
}
for (const name of matches(indexHtml, /data-route="([^"]+)"/g)) {
  check('links', pageNames.includes(name), `nav link data-route="${name}" is not a page in app/views.js`);
}

// Every relative import in every app script must land on a file that exists.
for (const file of walk(appDir).filter((f) => f.path.endsWith('.js'))) {
  const source = readText(join(appDir, file.path));
  for (const spec of matches(source, /(?:from|import)\s*'(\.[^']+)'/g)) {
    const target = resolve(dirname(join(appDir, file.path)), spec);
    check('links', existsSync(target), `${file.path} imports ${spec}, which does not exist`);
  }
}

// CSS may only reference files that sit beside it.
const css = readText(join(appDir, 'style.css'));
for (const ref of matches(css, /url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
  check('links', !/^(?:https?:)?\/\//.test(ref) && existsSync(join(appDir, ref)), `style.css references ${ref}, which is missing from app/`);
}

// shots.json is the screenshot script's script: its views must be routes and its files real.
const shots = JSON.parse(readText(join(here, 'shots.json'))) as { file: string; path: string }[];
for (const shot of shots) {
  check('routes', routePaths.includes(shot.path.replace(/^#/, '')), `shots.json view ${shot.path} is not a route in app/main.js`);
  check('screenshots', existsSync(join(shotsDir, shot.file)), `shots.json names ${shot.file}, which is missing from screenshots/`);
}

// --- 2. the figures -----------------------------------------------------------

const PUBLISHER = /(BPS|World Bank|\bUN\b|BPJS|Ministry|SSGI|National Nutrition Survey)/;
const YEAR = /(?:19|20)\d{2}/;
const labelled = (group: string, rows: { note?: string }[], what: string, needPublisher: boolean) => {
  check(group, rows.length > 0, `no ${what} found in app/data.js`);
  for (const row of rows) {
    check(group, typeof row.note === 'string' && YEAR.test(row.note), `a ${what} note carries no year: ${JSON.stringify(row)}`);
    if (needPublisher) {
      check(group, typeof row.note === 'string' && PUBLISHER.test(row.note), `a ${what} note names no publisher: ${JSON.stringify(row)}`);
    }
  }
};
labelled('figures', data.indicators, 'headline indicator', true);
labelled('figures', data.societyFacts, 'society fact', true);
labelled('figures', data.ageSummary, 'age summary', false);

for (const t of data.trade) {
  check('figures', t.label.length > 0 && t.value.length > 0, `a trade row is blank: ${JSON.stringify(t)}`);
}

const inOrder = (years: number[]) => years.every((y, i) => i === 0 || y > years[i - 1]);
check('figures', inOrder(data.populationTrend.map((p) => p.year)), 'populationTrend years are not increasing');
check('figures', data.populationTrend.every((p) => p.millions > 0), 'populationTrend holds a non-positive population');
check('figures',
  JSON.stringify(data.gdpGrowth.map((p) => p.year)) === JSON.stringify(data.inflation.map((p) => p.year)),
  'gdpGrowth and inflation do not cover the same years, though the economy page switches between them');
for (const [name, series] of [['gdpGrowth', data.gdpGrowth], ['inflation', data.inflation], ['stunting', data.stunting]] as const) {
  check('figures', inOrder(series.map((p) => p.year)), `${name} years are not increasing`);
  check('figures', series.every((p) => Number.isFinite(p.pct) && p.pct > -20 && p.pct < 100), `${name} holds an implausible percentage`);
}
check('figures',
  data.stunting[0].pct > data.stunting[data.stunting.length - 1].pct,
  'stunting has not fallen across the series, though the society page says it has');

const sectorTotal = data.sectors.reduce((sum, s) => sum + s.share, 0);
check('figures', Math.abs(sectorTotal - 100) <= 0.5, `sector shares add to ${sectorTotal}, not 100`);
for (const s of data.sectors) {
  check('figures', s.share > 0 && /^#[0-9a-f]{6}$/i.test(s.colour), `sector ${s.name} has a bad share or colour`);
}

const bandTotal = data.ageBands.reduce((sum, b) => sum + b.men + b.women, 0);
check('figures', data.ageBands.length >= 10, `only ${data.ageBands.length} age bands for the pyramid`);
check('figures', bandTotal >= 98 && bandTotal <= 102, `age band shares add to ${bandTotal.toFixed(1)}, far from 100 (rounding allowed)`);
check('figures', data.ageBands.every((b) => b.band.length > 0 && b.men >= 0 && b.women >= 0), 'an age band is blank or negative');

check('figures', data.provinces.length >= 30, `only ${data.provinces.length} provinces in the table`);
check('figures', new Set(data.provinces.map((p) => p.name)).size === data.provinces.length, 'the province table repeats a province');
check('figures', data.provinces.every((p) => p.capital.length > 0 && p.millions > 0), 'a province lacks a capital or a population');
check('figures',
  data.provinces.every((p, i) => i === 0 || p.millions <= data.provinces[i - 1].millions),
  'provinces are not in the descending order the page presents');
const census2020 = data.populationTrend.find((p) => p.year === 2020)?.millions ?? 0;
const provinceTotal = data.provinces.reduce((sum, p) => sum + p.millions, 0);
check('figures',
  census2020 > 0 && Math.abs(provinceTotal - census2020) / census2020 <= 0.02,
  `province populations add to ${provinceTotal.toFixed(2)}m but the 2020 census figure is ${census2020}m`);

check('figures', data.enrolment.every((e) => e.level.length > 0 && e.pct > 0 && e.pct <= 120), 'an enrolment row is blank or beyond a gross rate of 120');

// --- 3. screenshots and caps ----------------------------------------------------

const shotFiles = walk(shotsDir);
check('screenshots', shotFiles.length >= 3 && shotFiles.length <= 4, `expected 3 or 4 screenshots, found ${shotFiles.length}`);
for (const shot of shotFiles) {
  check('screenshots', shot.bytes > 0 && shot.bytes <= 262144, `${shot.path} is ${shot.bytes} bytes, outside the 256 KiB cap`);
  const head = readFileSync(join(shotsDir, shot.path)).subarray(0, 4);
  const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
  const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  check('screenshots',
    (shot.path.endsWith('.png') && isPng) || (/\.(?:jpg|jpeg)$/.test(shot.path) && isJpeg),
    `${shot.path} is not the PNG or JPEG its name claims`);
}

const appFiles = walk(appDir);
const appBytes = appFiles.reduce((sum, f) => sum + f.bytes, 0);
check('caps', appFiles.length <= 993, `app/ holds ${appFiles.length} files, over the scorer's 993 cap`);
check('caps', appBytes <= 16777216, `app/ holds ${appBytes} bytes, over the scorer's 16 MiB cap`);

// --- verdict, then the hand-in itself -------------------------------------------

if (problems.length > 0) {
  console.error(`Indonesia in Numbers: the site failed its pre-flight checks (${problems.length}):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the
// others refuse an entry the scorer would refuse. The vendored call below is unchanged from
// the kit starter, so dossier.json stays byte for byte what the scorer's copy writes.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// This program's build record, written after the dossier so the dossier's bytes are untouched.
const manifest = {
  site: 'Indonesia in Numbers',
  routes: routePaths.map((path, i) => ({ path, page: routePages[i] })),
  app: { files: appFiles, totalBytes: appBytes },
  figures: {
    indicators: data.indicators.length,
    ageSummary: data.ageSummary.length,
    societyFacts: data.societyFacts.length,
    trade: data.trade.length,
    provinces: data.provinces.length,
    provincePopulationMillions: Math.round(provinceTotal * 100) / 100,
    series: {
      populationTrend: data.populationTrend.length,
      ageBands: data.ageBands.length,
      gdpGrowth: data.gdpGrowth.length,
      inflation: data.inflation.length,
      sectors: data.sectors.length,
      enrolment: data.enrolment.length,
      stunting: data.stunting.length,
    },
  },
  screenshots: shotFiles,
  checksPassed: passed,
};
writeFileSync(join(out, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

const totalChecks = Object.values(passed).reduce((sum, n) => sum + n, 0);
console.log(`Indonesia in Numbers: ${totalChecks} pre-flight checks passed; site, dossier and manifest written to ${out}`);
