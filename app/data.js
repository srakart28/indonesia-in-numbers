// Indonesia in Numbers — all of the site's figures in one file, so the numbers are easy to audit.
// Every figure carries the publisher and year it is labelled with on the page. National figures are the
// widely published BPS (Statistics Indonesia) and World Bank values; province populations are the BPS
// 2020 Population Census. Where a value is an estimate or a rounded published figure, its note says so.

// The nine headline indicators on the overview page: value, unit, and the source line printed under it.
export const indicators = [
  { label: 'Population', value: '281.6', unit: 'million', note: 'Mid-year estimate · BPS, 2024' },
  { label: 'GDP', value: 'US$1.40', unit: 'trillion', note: 'Current prices · World Bank, 2024' },
  { label: 'GDP per capita', value: 'US$4,980', unit: '', note: 'Current prices · World Bank, 2024' },
  { label: 'GDP growth', value: '5.03', unit: '% a year', note: 'Annual growth · BPS, 2024' },
  { label: 'Inflation', value: '1.57', unit: '% a year', note: 'December, year on year · BPS, 2024' },
  { label: 'Unemployment', value: '4.91', unit: '% of labour force', note: 'Open unemployment, August · BPS, 2024' },
  { label: 'Poverty rate', value: '9.03', unit: '% of population', note: 'March survey · BPS, 2024' },
  { label: 'Life expectancy', value: '71.1', unit: 'years', note: 'At birth · World Bank, 2023' },
  { label: 'Literacy rate', value: '96', unit: '% of adults', note: 'Ages 15 and over · World Bank, 2020' },
];

// Population at each BPS census, millions of people.
export const populationTrend = [
  { year: 1971, millions: 119.2 },
  { year: 1980, millions: 147.5 },
  { year: 1990, millions: 179.4 },
  { year: 2000, millions: 206.3 },
  { year: 2010, millions: 237.6 },
  { year: 2020, millions: 270.2 },
  { year: 2024, millions: 281.6 },
];

// Age structure in 2024 (BPS / UN estimates, shares rounded): the pyramid's five-year bands as a
// percentage of the whole population, men on the left and women on the right.
export const ageBands = [
  { band: '80+', men: 0.5, women: 0.8 },
  { band: '75–79', men: 0.6, women: 0.8 },
  { band: '70–74', men: 0.9, women: 1.1 },
  { band: '65–69', men: 1.3, women: 1.5 },
  { band: '60–64', men: 1.8, women: 1.9 },
  { band: '55–59', men: 2.2, women: 2.3 },
  { band: '50–54', men: 2.6, women: 2.7 },
  { band: '45–49', men: 3.0, women: 3.1 },
  { band: '40–44', men: 3.4, women: 3.5 },
  { band: '35–39', men: 3.8, women: 3.8 },
  { band: '30–34', men: 4.1, women: 4.0 },
  { band: '25–29', men: 4.2, women: 4.1 },
  { band: '20–24', men: 4.3, women: 4.1 },
  { band: '15–19', men: 4.3, women: 4.1 },
  { band: '10–14', men: 4.4, women: 4.2 },
  { band: '5–9', men: 4.5, women: 4.3 },
  { band: '0–4', men: 4.6, women: 4.4 },
];

export const ageSummary = [
  { label: 'Children, 0–14', share: '24.8%', note: 'Share of population, 2024' },
  { label: 'Working age, 15–64', share: '68.0%', note: 'Share of population, 2024' },
  { label: 'Older people, 65+', share: '7.2%', note: 'Share of population, 2024' },
  { label: 'Median age', share: '30.4 years', note: 'UN estimate, 2024' },
  { label: 'Urban population', share: '59%', note: 'World Bank, 2024' },
  { label: 'Population density', share: '148 / km²', note: 'Population over land area, 2024' },
];

// Annual GDP growth and consumer-price inflation, percent a year (BPS).
export const gdpGrowth = [
  { year: 2015, pct: 4.88 }, { year: 2016, pct: 5.03 }, { year: 2017, pct: 5.07 },
  { year: 2018, pct: 5.17 }, { year: 2019, pct: 5.02 }, { year: 2020, pct: -2.07 },
  { year: 2021, pct: 3.70 }, { year: 2022, pct: 5.31 }, { year: 2023, pct: 5.05 },
  { year: 2024, pct: 5.03 },
];

export const inflation = [
  { year: 2015, pct: 3.35 }, { year: 2016, pct: 3.02 }, { year: 2017, pct: 3.61 },
  { year: 2018, pct: 3.13 }, { year: 2019, pct: 2.72 }, { year: 2020, pct: 1.68 },
  { year: 2021, pct: 1.87 }, { year: 2022, pct: 5.51 }, { year: 2023, pct: 2.61 },
  { year: 2024, pct: 1.57 },
];

// Shares of GDP by industry, percent, rounded (BPS, 2024).
export const sectors = [
  { name: 'Manufacturing', share: 19, colour: '#b5341f' },
  { name: 'Agriculture & forestry', share: 13, colour: '#2e7d32' },
  { name: 'Wholesale & retail trade', share: 13, colour: '#1565c0' },
  { name: 'Construction', share: 10, colour: '#ef6c00' },
  { name: 'Mining & quarrying', share: 10, colour: '#6a4c93' },
  { name: 'Transport & storage', share: 6, colour: '#00838f' },
  { name: 'Finance & insurance', share: 4, colour: '#455a64' },
  { name: 'All other industries', share: 25, colour: '#bdbdbd' },
];

// Foreign trade in goods (BPS, 2024), US$ billions.
export const trade = [
  { label: 'Exports', value: 'US$264.7 bn' },
  { label: 'Imports', value: 'US$233.7 bn' },
  { label: 'Trade surplus', value: 'US$31.0 bn' },
  { label: 'Main exports', value: 'Coal, palm oil, iron & steel, oil & gas' },
];

// Provinces as constituted at the 2020 census: name, capital, census population in millions.
// Papua has since been divided into six provinces (2022); the census counted it as two.
export const provinces = [
  { name: 'West Java', capital: 'Bandung', millions: 48.27 },
  { name: 'East Java', capital: 'Surabaya', millions: 40.67 },
  { name: 'Central Java', capital: 'Semarang', millions: 36.52 },
  { name: 'North Sumatra', capital: 'Medan', millions: 14.80 },
  { name: 'Banten', capital: 'Serang', millions: 11.90 },
  { name: 'Jakarta', capital: 'Jakarta', millions: 10.56 },
  { name: 'South Sulawesi', capital: 'Makassar', millions: 9.07 },
  { name: 'Lampung', capital: 'Bandar Lampung', millions: 9.01 },
  { name: 'South Sumatra', capital: 'Palembang', millions: 8.47 },
  { name: 'Riau', capital: 'Pekanbaru', millions: 6.39 },
  { name: 'West Sumatra', capital: 'Padang', millions: 5.53 },
  { name: 'West Kalimantan', capital: 'Pontianak', millions: 5.41 },
  { name: 'East Nusa Tenggara', capital: 'Kupang', millions: 5.33 },
  { name: 'West Nusa Tenggara', capital: 'Mataram', millions: 5.32 },
  { name: 'Aceh', capital: 'Banda Aceh', millions: 5.27 },
  { name: 'Bali', capital: 'Denpasar', millions: 4.32 },
  { name: 'South Kalimantan', capital: 'Banjarmasin', millions: 4.07 },
  { name: 'East Kalimantan', capital: 'Samarinda', millions: 3.77 },
  { name: 'Yogyakarta', capital: 'Yogyakarta', millions: 3.67 },
  { name: 'Jambi', capital: 'Jambi', millions: 3.55 },
  { name: 'Papua', capital: 'Jayapura', millions: 3.17 },
  { name: 'Central Sulawesi', capital: 'Palu', millions: 2.99 },
  { name: 'Central Kalimantan', capital: 'Palangka Raya', millions: 2.70 },
  { name: 'Southeast Sulawesi', capital: 'Kendari', millions: 2.62 },
  { name: 'North Sulawesi', capital: 'Manado', millions: 2.62 },
  { name: 'Riau Islands', capital: 'Tanjung Pinang', millions: 2.06 },
  { name: 'Bengkulu', capital: 'Bengkulu', millions: 2.01 },
  { name: 'Maluku', capital: 'Ambon', millions: 1.85 },
  { name: 'Bangka Belitung', capital: 'Pangkal Pinang', millions: 1.46 },
  { name: 'West Sulawesi', capital: 'Mamuju', millions: 1.42 },
  { name: 'North Maluku', capital: 'Sofifi', millions: 1.28 },
  { name: 'Gorontalo', capital: 'Gorontalo', millions: 1.17 },
  { name: 'West Papua', capital: 'Manokwari', millions: 1.13 },
  { name: 'North Kalimantan', capital: 'Tanjung Selor', millions: 0.70 },
];

// School participation by level, gross enrolment, percent (BPS, 2024; tertiary: World Bank, 2023).
export const enrolment = [
  { level: 'Primary', pct: 106 },
  { level: 'Lower secondary', pct: 92 },
  { level: 'Upper secondary', pct: 87 },
  { level: 'Tertiary', pct: 32 },
];

export const societyFacts = [
  { label: 'Mean years of schooling', value: '9.2 years', note: 'Adults 25 and over · BPS, 2024' },
  { label: 'Expected years of schooling', value: '13.2 years', note: 'For a child starting school · BPS, 2024' },
  { label: 'Literacy rate', value: '96%', note: 'Ages 15 and over · World Bank, 2020' },
  { label: 'Infant mortality', value: '17 per 1,000', note: 'Deaths before age one, per 1,000 live births · World Bank, 2023' },
  { label: 'Health insurance cover', value: '≈98%', note: 'Covered by the national JKN scheme · BPJS Kesehatan, 2024' },
  { label: 'Access to electricity', value: '99.8%', note: 'Electrification ratio · Ministry of Energy, 2024' },
];

// Children under five who are stunted, percent (National Nutrition Survey, SSGI).
export const stunting = [
  { year: 2018, pct: 30.8 },
  { year: 2019, pct: 27.7 },
  { year: 2021, pct: 24.4 },
  { year: 2022, pct: 21.6 },
  { year: 2023, pct: 21.5 },
];
