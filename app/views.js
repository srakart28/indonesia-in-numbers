// The five sections of Indonesia in Numbers. Each page returns its HTML and a mount() that draws its
// charts and wires its controls once the HTML is on the page. Figures come from data.js and every
// section ends with the sources its figures are labelled with.

import {
  ageBands, ageSummary, enrolment, gdpGrowth, indicators, inflation, populationTrend,
  provinces, sectors, societyFacts, stunting, trade,
} from './data.js';
import { barChart, donutChart, lineChart, pyramidChart } from './charts.js';

const sourceLine = (text) => `<p class="sources">Sources: ${text}</p>`;
const chartCard = (title, note, canvasId) => `
  <section class="card chart-card">
    <h2>${title}</h2>
    <p class="chart-note">${note}</p>
    <canvas id="${canvasId}"></canvas>
  </section>`;

function overviewPage() {
  const cards = indicators.map((i) => `
    <article class="stat">
      <p class="stat-label">${i.label}</p>
      <p class="stat-value">${i.value}${i.unit ? ` <span class="stat-unit">${i.unit}</span>` : ''}</p>
      <p class="stat-note">${i.note}</p>
    </article>`).join('');
  return {
    title: 'Overview',
    html: `
      <p class="lede">The headline numbers for Indonesia — the world's fourth most populous country,
      Southeast Asia's largest economy, and an archipelago of more than 17,000 islands home to
      281.6 million people. Every figure below is labelled with who published it and when.</p>
      <div class="stat-grid">${cards}</div>
      ${chartCard('Population keeps growing, more slowly',
        'People counted at each census, and the 2024 mid-year estimate, in millions (BPS).',
        'population-chart')}
      <section class="card">
        <h2>The country at a glance</h2>
        <ul class="glance">
          <li><strong>Capital</strong> — Jakarta, on the island of Java</li>
          <li><strong>Provinces</strong> — 38, the newest four created in Papua in 2022</li>
          <li><strong>Land area</strong> — 1.9 million km² across more than 17,000 islands</li>
          <li><strong>Most populous island</strong> — Java, with about 56% of the population (BPS, 2020)</li>
          <li><strong>Official language</strong> — Indonesian (Bahasa Indonesia)</li>
          <li><strong>Currency</strong> — Rupiah (IDR)</li>
        </ul>
      </section>
      ${sourceLine('BPS (Statistics Indonesia) mid-year estimate and censuses; World Bank World Development Indicators, 2024.')}`,
    mount() {
      lineChart(document.getElementById('population-chart'),
        populationTrend.map((p) => ({ year: p.year, value: p.millions })),
        { format: (v) => `${Math.round(v)}m` });
    },
  };
}

function demographicsPage() {
  const summary = ageSummary.map((s) => `
    <article class="stat">
      <p class="stat-label">${s.label}</p>
      <p class="stat-value">${s.share}</p>
      <p class="stat-note">${s.note}</p>
    </article>`).join('');
  return {
    title: 'Demographics',
    html: `
      <p class="lede">Indonesia's population is young but ageing: the median age is about 30, the share
      of children is falling, and the working-age share is near its peak — the demographic window the
      government's plans count on.</p>
      ${chartCard('Population pyramid, 2024',
        'Share of the whole population in each five-year age band, by sex (BPS / UN estimates, rounded).',
        'pyramid-chart')}
      <div class="stat-grid">${summary}</div>
      ${chartCard('Seven censuses, fifty years of growth',
        'Population at each census from 1971 to 2020, and the 2024 estimate, in millions (BPS).',
        'trend-chart')}
      <section class="card">
        <h2>What the shape of the pyramid says</h2>
        <p>The wide base of the 1971 pyramid has narrowed steadily: families are smaller than they were,
        so each new five-year band is now only a little larger than the one before it. The bulge in the
        middle — today's 20-to-44-year-olds — is the workforce the economy runs on. Above them the bands
        widen slowly at the top as life expectancy rises: about 7 in every 100 Indonesians are now 65 or
        older, a share that will keep growing for decades.</p>
      </section>
      ${sourceLine('BPS Population Censuses 1971–2020 and 2024 mid-year estimate; UN World Population Prospects, 2024; World Bank, 2024.')}`,
    mount() {
      pyramidChart(document.getElementById('pyramid-chart'), ageBands);
      lineChart(document.getElementById('trend-chart'),
        populationTrend.map((p) => ({ year: p.year, value: p.millions })),
        { format: (v) => `${Math.round(v)}m` });
    },
  };
}

function economyPage() {
  const tradeCards = trade.map((t) => `
    <article class="stat">
      <p class="stat-label">${t.label}</p>
      <p class="stat-value stat-value-small">${t.value}</p>
      <p class="stat-note">Goods, BPS 2024</p>
    </article>`).join('');
  return {
    title: 'Economy',
    html: `
      <p class="lede">Growth has held close to 5% a year for a decade, interrupted once by the pandemic.
      Manufacturing is the largest single industry, and the country runs a goods trade surplus on coal,
      palm oil and metals.</p>
      <section class="card chart-card">
        <h2>Growth and inflation</h2>
        <p class="chart-note">Percent a year (BPS). Use the buttons to switch the series.</p>
        <div class="toggle" role="group" aria-label="Choose a series">
          <button type="button" id="series-growth" class="toggle-on">GDP growth</button>
          <button type="button" id="series-inflation">Inflation</button>
        </div>
        <canvas id="economy-chart"></canvas>
        <p class="chart-caption" id="economy-caption"></p>
      </section>
      ${chartCard('What the economy makes',
        'Each industry\'s share of GDP in 2024, percent, rounded (BPS).', 'sector-chart')}
      <h2 class="section-heading">Trade in goods, 2024</h2>
      <div class="stat-grid">${tradeCards}</div>
      ${sourceLine('BPS national accounts and foreign trade statistics, 2024.')}`,
    mount() {
      const canvas = document.getElementById('economy-chart');
      const caption = document.getElementById('economy-caption');
      const growthBtn = document.getElementById('series-growth');
      const inflationBtn = document.getElementById('series-inflation');
      const show = (which) => {
        const series = which === 'growth' ? gdpGrowth : inflation;
        lineChart(canvas, series.map((p) => ({ year: p.year, value: p.pct })),
          { colour: which === 'growth' ? '#b5341f' : '#1565c0', format: (v) => `${v}%` });
        caption.textContent = which === 'growth'
          ? 'Growth dipped once, in 2020, when output shrank 2.07% during the pandemic, and has been back near 5% since 2022.'
          : 'Inflation spiked to 5.51% in 2022 as fuel prices rose, then eased to 1.57% by December 2024 — inside the central bank\'s target band.';
        growthBtn.classList.toggle('toggle-on', which === 'growth');
        inflationBtn.classList.toggle('toggle-on', which === 'inflation');
      };
      growthBtn.addEventListener('click', () => show('growth'));
      inflationBtn.addEventListener('click', () => show('inflation'));
      show('growth');
      donutChart(document.getElementById('sector-chart'), sectors);
    },
  };
}

function provincesPage() {
  return {
    title: 'Provinces',
    html: `
      <p class="lede">All 34 provinces as they stood at the 2020 census, from West Java's 48 million to
      North Kalimantan's 700,000. Search by province or capital, and click any column heading to sort.</p>
      <section class="card">
        <div class="table-tools">
          <label>Search <input type="search" id="province-search" placeholder="e.g. Java, Medan, Bali"></label>
          <p class="table-count" id="province-count"></p>
        </div>
        <div class="table-scroll">
          <table id="province-table">
            <thead>
              <tr>
                <th data-key="rank" scope="col">#</th>
                <th data-key="name" scope="col">Province</th>
                <th data-key="capital" scope="col">Capital</th>
                <th data-key="millions" scope="col" class="num">Population (millions)</th>
                <th data-key="share" scope="col" class="num">Share of Indonesia</th>
              </tr>
            </thead>
            <tbody id="province-body"></tbody>
          </table>
        </div>
        <p class="table-note">Papua has since been divided into six provinces (2022), taking the national
        total to 38; the 2020 census counted the region as the two provinces listed here.</p>
      </section>
      ${sourceLine('BPS Population Census, 2020. Shares are of the census total of 270.2 million.')}`,
    mount() {
      const total = provinces.reduce((sum, p) => sum + p.millions, 0);
      const rows = provinces.map((p, i) => ({ ...p, rank: i + 1, share: (p.millions / total) * 100 }));
      const body = document.getElementById('province-body');
      const count = document.getElementById('province-count');
      const search = document.getElementById('province-search');
      let sortKey = 'millions';
      let sortDir = -1;

      const render = () => {
        const term = search.value.trim().toLowerCase();
        const shown = rows
          .filter((r) => !term || r.name.toLowerCase().includes(term) || r.capital.toLowerCase().includes(term))
          .sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0) * sortDir);
        body.innerHTML = shown.map((r) => `
          <tr>
            <td>${r.rank}</td>
            <td><strong>${r.name}</strong></td>
            <td>${r.capital}</td>
            <td class="num">${r.millions.toFixed(2)}</td>
            <td class="num">${r.share.toFixed(1)}%</td>
          </tr>`).join('');
        count.textContent = `Showing ${shown.length} of ${rows.length} provinces`;
        document.querySelectorAll('#province-table th').forEach((th) => {
          const active = th.dataset.key === sortKey;
          th.classList.toggle('sorted', active);
          if (active) th.dataset.dir = sortDir === 1 ? '▲' : '▼';
          else delete th.dataset.dir;
        });
      };
      search.addEventListener('input', render);
      document.querySelectorAll('#province-table th').forEach((th) => {
        th.addEventListener('click', () => {
          const key = th.dataset.key;
          if (key === sortKey) sortDir *= -1;
          else { sortKey = key; sortDir = key === 'name' || key === 'capital' ? 1 : -1; }
          render();
        });
      });
      render();
    },
  };
}

function societyPage() {
  const facts = societyFacts.map((f) => `
    <article class="stat">
      <p class="stat-label">${f.label}</p>
      <p class="stat-value stat-value-small">${f.value}</p>
      <p class="stat-note">${f.note}</p>
    </article>`).join('');
  return {
    title: 'Society',
    html: `
      <p class="lede">Schooling is nearly universal at primary level and health cover is close to it,
      but the gaps the statistics keep pointing at are in secondary completion, child nutrition and
      how long adults spend in education.</p>
      ${chartCard('Who is in education',
        'Gross enrolment by level, percent of the age group (BPS, 2024; tertiary: World Bank, 2023). Primary passes 100 because some pupils are outside the official age range.',
        'enrolment-chart')}
      <div class="stat-grid">${facts}</div>
      ${chartCard('Child stunting is falling',
        'Children under five who are stunted, percent (National Nutrition Survey, SSGI). No survey was held in 2020.',
        'stunting-chart')}
      <section class="card">
        <h2>Reading the society numbers</h2>
        <p>Nearly every Indonesian child starts school, and 96 in 100 adults can read and write. The drop
        comes later: about a third of the age group reaches tertiary education, and the average adult has
        spent 9.2 years in school. In health, the national insurance scheme now covers almost everyone on
        paper, while the stubborn figure is stunting — one child in five is still shorter than the healthy
        range for their age, though the share has fallen by almost a third since 2018.</p>
      </section>
      ${sourceLine('BPS education and health statistics, 2024; World Bank, 2020–2023; SSGI National Nutrition Survey; BPJS Kesehatan, 2024.')}`,
    mount() {
      barChart(document.getElementById('enrolment-chart'),
        enrolment.map((e) => ({ label: e.level, value: e.pct })),
        { format: (v) => `${v}%` });
      barChart(document.getElementById('stunting-chart'),
        stunting.map((s) => ({ label: String(s.year), value: s.pct })),
        { colour: '#2e7d32', format: (v) => `${v}%` });
    },
  };
}

export const pages = {
  overview: overviewPage,
  demographics: demographicsPage,
  economy: economyPage,
  provinces: provincesPage,
  society: societyPage,
};
