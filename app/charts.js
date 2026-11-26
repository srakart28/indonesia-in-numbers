// Canvas charts for Indonesia in Numbers, drawn by hand — no chart library.
// Each function takes a <canvas> and plain data, sizes the canvas to its box at the screen's pixel
// ratio so lines stay sharp, and paints axes, gridlines, labels and values.

const INK = '#1c2733';
const FAINT = '#6b7a89';
const GRID = '#dde4ea';
const RED = '#b5341f';
const BLUE = '#1565c0';

// Make the canvas back a box of cssWidth x cssHeight CSS pixels, scaled for the display.
function prepare(canvas, cssHeight) {
  const cssWidth = canvas.clientWidth || canvas.parentElement.clientWidth;
  const ratio = window.devicePixelRatio || 1;
  canvas.style.height = `${cssHeight}px`;
  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = INK;
  return { ctx, width: cssWidth, height: cssHeight };
}

function niceCeiling(value) {
  const steps = [1, 1.25, 1.5, 2, 2.5, 5, 10];
  const power = 10 ** Math.floor(Math.log10(value));
  for (const step of steps) if (value <= step * power) return step * power;
  return 10 * power;
}

// A line chart of {year, value} points, with the value of the first and last point labelled.
export function lineChart(canvas, points, { colour = RED, height = 260, format = (v) => v } = {}) {
  const { ctx, width, height: h } = prepare(canvas, height);
  const pad = { left: 44, right: 16, top: 14, bottom: 26 };
  const plotW = width - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const values = points.map((p) => p.value);
  const max = niceCeiling(Math.max(...values) * 1.05);
  const min = Math.min(0, Math.min(...values));
  const x = (i) => pad.left + (i / (points.length - 1)) * plotW;
  const y = (v) => pad.top + plotH - ((v - min) / (max - min)) * plotH;
  // Gridline labels are rounded to suit the range, so an axis reads 7% not 6.9825%.
  const decimals = max - min >= 50 ? 0 : max - min >= 5 ? 1 : 2;
  const gridLabel = (v) => format(Number(v.toFixed(decimals)));

  ctx.strokeStyle = GRID;
  ctx.fillStyle = FAINT;
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i += 1) {
    const v = min + ((max - min) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.left, y(v));
    ctx.lineTo(width - pad.right, y(v));
    ctx.stroke();
    ctx.fillText(gridLabel(v), pad.left - 6, y(v) + 4);
  }
  ctx.textAlign = 'center';
  points.forEach((p, i) => {
    if (i % Math.ceil(points.length / 7) === 0 || i === points.length - 1) {
      ctx.fillText(String(p.year), x(i), h - 8);
    }
  });

  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(x(i), y(p.value)) : ctx.lineTo(x(i), y(p.value))));
  ctx.stroke();
  ctx.fillStyle = colour;
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(p.value), 3, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(format(points[0].value), x(0) + 6, y(points[0].value) - 8);
  ctx.textAlign = 'right';
  const last = points[points.length - 1];
  ctx.fillText(format(last.value), x(points.length - 1) - 6, y(last.value) - 8);
}

// Vertical bars for {label, value} rows, value on top of each bar. A value may pass 100 (gross rates).
export function barChart(canvas, rows, { colour = BLUE, height = 240, format = (v) => `${v}` } = {}) {
  const { ctx, width, height: h } = prepare(canvas, height);
  const pad = { left: 40, right: 12, top: 22, bottom: 40 };
  const plotW = width - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const max = niceCeiling(Math.max(...rows.map((r) => r.value)) * 1.05);
  const y = (v) => pad.top + plotH - (v / max) * plotH;

  ctx.strokeStyle = GRID;
  ctx.fillStyle = FAINT;
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i += 1) {
    const v = (max * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.left, y(v));
    ctx.lineTo(width - pad.right, y(v));
    ctx.stroke();
    ctx.fillText(format(v), pad.left - 6, y(v) + 4);
  }

  const slot = plotW / rows.length;
  const barW = Math.min(64, slot * 0.55);
  rows.forEach((row, i) => {
    const cx = pad.left + slot * i + slot / 2;
    ctx.fillStyle = colour;
    ctx.fillRect(cx - barW / 2, y(row.value), barW, pad.top + plotH - y(row.value));
    ctx.fillStyle = INK;
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(format(row.value), cx, y(row.value) - 6);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = FAINT;
    wrapLabel(ctx, row.label, cx, h - 24, slot - 6);
  });
}

function wrapLabel(ctx, text, cx, yTop, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if (ctx.measureText(`${line} ${word}`).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, cx, yTop + i * 13));
}

// A donut of {name, share, colour} slices with a legend down the right side.
export function donutChart(canvas, slices, { height = 260 } = {}) {
  const { ctx, width } = prepare(canvas, height);
  const total = slices.reduce((sum, s) => sum + s.share, 0);
  const radius = Math.min(height / 2 - 14, width * 0.22);
  const cx = radius + 16;
  const cy = height / 2;
  let angle = -Math.PI / 2;
  for (const slice of slices) {
    const sweep = (slice.share / total) * Math.PI * 2;
    ctx.fillStyle = slice.colour;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fill();
    angle += sweep;
  }
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.58, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Share of GDP', cx, cy + 4);

  const legendX = cx + radius + 28;
  let legendY = cy - ((slices.length - 1) * 21) / 2;
  ctx.textAlign = 'left';
  for (const slice of slices) {
    ctx.fillStyle = slice.colour;
    ctx.fillRect(legendX, legendY - 9, 12, 12);
    ctx.fillStyle = INK;
    ctx.font = '12.5px system-ui, sans-serif';
    ctx.fillText(`${slice.name} — ${slice.share}%`, legendX + 19, legendY + 2);
    legendY += 21;
  }
}

// A population pyramid: one row per age band, men's bars running left from the centre and women's
// right, each bar's end labelled with its share of the population.
export function pyramidChart(canvas, bands, { height = 460 } = {}) {
  const { ctx, width, height: h } = prepare(canvas, height);
  const centre = width / 2;
  const labelW = 44;
  const maxShare = 5;
  const halfW = centre - labelW / 2 - 46;
  const rowH = (h - 30) / bands.length;

  ctx.textAlign = 'center';
  ctx.fillStyle = FAINT;
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('Men', centre - halfW / 2, 14);
  ctx.fillText('Women', centre + halfW / 2, 14);

  bands.forEach((band, i) => {
    const yTop = 24 + i * rowH;
    const barH = Math.min(15, rowH - 4);
    const menW = (band.men / maxShare) * halfW;
    const womenW = (band.women / maxShare) * halfW;
    ctx.fillStyle = BLUE;
    ctx.fillRect(centre - labelW / 2 - menW, yTop, menW, barH);
    ctx.fillStyle = RED;
    ctx.fillRect(centre + labelW / 2, yTop, womenW, barH);
    ctx.fillStyle = INK;
    ctx.font = '11.5px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(band.band, centre, yTop + barH - 3);
    ctx.fillStyle = FAINT;
    ctx.textAlign = 'right';
    ctx.fillText(`${band.men}%`, centre - labelW / 2 - menW - 5, yTop + barH - 3);
    ctx.textAlign = 'left';
    ctx.fillText(`${band.women}%`, centre + labelW / 2 + womenW + 5, yTop + barH - 3);
  });
}
