import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const W = 1200;
const H = 630;

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

function hex(color, alpha = 1) {
  const r = parseInt(color.slice(1,3),16);
  const g = parseInt(color.slice(3,5),16);
  const b = parseInt(color.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Background
const bgGrad = ctx.createLinearGradient(0, 0, W, H);
bgGrad.addColorStop(0,   '#07080A');
bgGrad.addColorStop(0.5, '#090B0E');
bgGrad.addColorStop(1,   '#060709');
ctx.fillStyle = bgGrad;
ctx.fillRect(0, 0, W, H);

// Subtle grid
ctx.strokeStyle = 'rgba(255,255,255,0.025)';
ctx.lineWidth = 0.5;
const gridSize = 40;
for (let x = 0; x <= W; x += gridSize) {
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
}
for (let y = 0; y <= H; y += gridSize) {
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
}

// Ambient glow — center right
const glowR = ctx.createRadialGradient(820, 315, 0, 820, 315, 400);
glowR.addColorStop(0,   'rgba(6,182,212,0.12)');
glowR.addColorStop(0.5, 'rgba(6,182,212,0.04)');
glowR.addColorStop(1,   'rgba(6,182,212,0)');
ctx.fillStyle = glowR;
ctx.fillRect(0, 0, W, H);

// Secondary ambient glow — bottom left
const glowL = ctx.createRadialGradient(200, 500, 0, 200, 500, 280);
glowL.addColorStop(0,   'rgba(99,102,241,0.1)');
glowL.addColorStop(1,   'rgba(99,102,241,0)');
ctx.fillStyle = glowL;
ctx.fillRect(0, 0, W, H);

// === DASHBOARD CARD (center-right) ===
const cardX = 580, cardY = 60, cardW = 570, cardH = 510;
const cardRadius = 18;

// Card shadow / glow
const cardGlow = ctx.createRadialGradient(cardX + cardW/2, cardY + cardH/2, 0, cardX + cardW/2, cardY + cardH/2, cardW * 0.75);
cardGlow.addColorStop(0,   'rgba(6,182,212,0.08)');
cardGlow.addColorStop(1,   'rgba(6,182,212,0)');
ctx.fillStyle = cardGlow;
ctx.fillRect(cardX - 60, cardY - 60, cardW + 120, cardH + 120);

// Card body
ctx.save();
ctx.beginPath();
ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
ctx.clip();

const cardBg = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
cardBg.addColorStop(0, 'rgba(18,20,26,0.98)');
cardBg.addColorStop(1, 'rgba(11,13,17,0.98)');
ctx.fillStyle = cardBg;
ctx.fillRect(cardX, cardY, cardW, cardH);
ctx.restore();

// Card border
ctx.save();
ctx.beginPath();
ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
ctx.strokeStyle = 'rgba(6,182,212,0.2)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.restore();

// Card top bar
ctx.fillStyle = 'rgba(255,255,255,0.03)';
ctx.fillRect(cardX, cardY, cardW, 44);
ctx.strokeStyle = 'rgba(255,255,255,0.06)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(cardX, cardY + 44); ctx.lineTo(cardX + cardW, cardY + 44); ctx.stroke();

// Top bar dots
const dotColors = ['#EF4444','#F59E0B','#10B981'];
dotColors.forEach((c,i) => {
  ctx.beginPath();
  ctx.arc(cardX + 18 + i * 18, cardY + 22, 5, 0, Math.PI * 2);
  ctx.fillStyle = c + '80';
  ctx.fill();
});

// Top bar label
ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.25)';
ctx.fillText('Artist OS  —  All American Rejects', cardX + 80, cardY + 27);

// Status dot
ctx.beginPath();
ctx.arc(cardX + cardW - 20, cardY + 22, 4, 0, Math.PI * 2);
ctx.fillStyle = '#10B981';
ctx.fill();
ctx.beginPath();
ctx.arc(cardX + cardW - 20, cardY + 22, 7, 0, Math.PI * 2);
ctx.fillStyle = 'rgba(16,185,129,0.2)';
ctx.fill();

// === ARTIST HEADER SECTION ===
const ah = cardY + 60;

// Avatar circle
ctx.beginPath();
ctx.arc(cardX + 32, ah + 22, 22, 0, Math.PI * 2);
const avGrad = ctx.createLinearGradient(cardX + 10, ah, cardX + 54, ah + 44);
avGrad.addColorStop(0, '#06B6D4');
avGrad.addColorStop(1, '#3B82F6');
ctx.fillStyle = avGrad;
ctx.fill();

// Avatar initials
ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#fff';
ctx.textAlign = 'center';
ctx.fillText('AAR', cardX + 32, ah + 27);
ctx.textAlign = 'left';

// Artist name
ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#ffffff';
ctx.fillText('All American Rejects', cardX + 64, ah + 16);

// Label tag
roundRect(ctx, cardX + 64, ah + 22, 78, 16, 4, 'rgba(6,182,212,0.12)', 'rgba(6,182,212,0.3)');
ctx.font = '500 9px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#06B6D4';
ctx.fillText('SPIN Records', cardX + 73, ah + 33);

// Momentum badge
roundRect(ctx, cardX + 152, ah + 22, 72, 16, 4, 'rgba(16,185,129,0.12)', 'rgba(16,185,129,0.3)');
ctx.font = '500 9px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#10B981';
ctx.fillText('▲ 94 Momentum', cardX + 158, ah + 33);

// Divider
ctx.strokeStyle = 'rgba(255,255,255,0.05)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(cardX + 16, ah + 54); ctx.lineTo(cardX + cardW - 16, ah + 54); ctx.stroke();

// === METRICS ROW ===
const mr = ah + 68;
const metrics = [
  { label: 'Monthly Listeners', value: '4.2M', delta: '+12%', color: '#06B6D4' },
  { label: 'Total Streams', value: '182M',  delta: '+8%',  color: '#10B981' },
  { label: 'Revenue (LTM)',   value: '$218K', delta: '+24%', color: '#F59E0B' },
];
const mW = (cardW - 48) / 3;
metrics.forEach((m, i) => {
  const mx = cardX + 16 + i * (mW + 8);
  roundRect(ctx, mx, mr, mW, 62, 10, 'rgba(255,255,255,0.025)', 'rgba(255,255,255,0.06)');
  ctx.font = '500 9px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText(m.label, mx + 12, mr + 16);
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(m.value, mx + 12, mr + 40);
  roundRect(ctx, mx + 12, mr + 46, 38, 12, 4, m.color + '20', m.color + '40');
  ctx.font = '600 8px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = m.color;
  ctx.fillText(m.delta + ' YTD', mx + 18, mr + 55);
});

// === RELEASE PLAN ROW ===
const rr = mr + 80;
ctx.font = '600 9px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.2)';
ctx.fillText('ACTIVE RELEASES', cardX + 16, rr);

const releases = [
  { title: 'Move Along (Deluxe)',   status: 'Pre-Save Live',   color: '#06B6D4', date: 'Jun 2026' },
  { title: 'Untitled Summer Single', status: 'In Production',  color: '#F59E0B', date: 'Aug 2026' },
];
releases.forEach((r, i) => {
  const rx = cardX + 16, ry = rr + 8 + i * 46;
  roundRect(ctx, rx, ry, cardW - 32, 38, 8, 'rgba(255,255,255,0.018)', 'rgba(255,255,255,0.06)');
  ctx.beginPath();
  ctx.arc(rx + 18, ry + 19, 5, 0, Math.PI * 2);
  ctx.fillStyle = r.color;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rx + 18, ry + 19, 8, 0, Math.PI * 2);
  ctx.fillStyle = r.color + '30';
  ctx.fill();
  ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText(r.title, rx + 32, ry + 15);
  ctx.font = '500 9px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText(r.date, rx + 32, ry + 29);
  roundRect(ctx, rx + cardW - 100, ry + 10, 72, 18, 5, r.color + '18', r.color + '35');
  ctx.font = '600 8px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = r.color;
  ctx.textAlign = 'center';
  ctx.fillText(r.status, rx + cardW - 64, ry + 22);
  ctx.textAlign = 'left';
});

// === CAMPAIGN ACTIONS ===
const cr = rr + 108;
ctx.font = '600 9px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.2)';
ctx.fillText('AI CAMPAIGN ACTIONS', cardX + 16, cr);

const actions = [
  { label: 'Launch Pre-Save Campaign',    agent: 'Campaign AI',  color: '#06B6D4' },
  { label: 'Pitch Spotify Editorial',     agent: 'Release AI',   color: '#8B5CF6' },
  { label: 'Activate Fan Cluster Push',   agent: 'Growth AI',    color: '#10B981' },
];
actions.forEach((a, i) => {
  const ax = cardX + 16, ay = cr + 8 + i * 36;
  roundRect(ctx, ax, ay, cardW - 32, 28, 6, 'rgba(255,255,255,0.015)', 'rgba(255,255,255,0.05)');
  roundRect(ctx, ax + 8, ay + 8, 6, 12, 2, a.color, 'transparent');
  ctx.font = '500 10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText(a.label, ax + 22, ay + 18);
  roundRect(ctx, ax + cardW - 78, ay + 7, 54, 14, 4, a.color + '20', a.color + '40');
  ctx.font = '500 8px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = a.color;
  ctx.textAlign = 'center';
  ctx.fillText(a.agent, ax + cardW - 51, ay + 17);
  ctx.textAlign = 'left';
});

// Card bottom gradient fade
const cardFade = ctx.createLinearGradient(cardX, cardY + cardH - 60, cardX, cardY + cardH);
cardFade.addColorStop(0, 'rgba(11,13,17,0)');
cardFade.addColorStop(1, 'rgba(11,13,17,0.95)');
ctx.fillStyle = cardFade;
ctx.save();
ctx.beginPath();
ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
ctx.clip();
ctx.fillRect(cardX, cardY + cardH - 60, cardW, 60);
ctx.restore();

// === LEFT SIDE BRANDING ===
const lx = 64;

// GMG Logo mark
const logoY = 80;
ctx.save();
const lgGrad = ctx.createLinearGradient(lx, logoY, lx + 48, logoY + 48);
lgGrad.addColorStop(0, '#06B6D4');
lgGrad.addColorStop(1, '#3B82F6');
ctx.beginPath();
ctx.roundRect(lx, logoY, 48, 48, 10);
ctx.fillStyle = lgGrad;
ctx.fill();
ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#fff';
ctx.textAlign = 'center';
ctx.fillText('G', lx + 24, logoY + 32);
ctx.textAlign = 'left';
ctx.restore();

// Brand text
ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = '#ffffff';
ctx.fillText('Greater Music Group', lx, logoY + 82);
ctx.font = '500 13px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.3)';
ctx.fillText('Artist OS  ·  Powered by AI', lx, logoY + 100);

// Separator
ctx.strokeStyle = 'rgba(6,182,212,0.3)';
ctx.lineWidth = 1.5;
ctx.beginPath(); ctx.moveTo(lx, logoY + 116); ctx.lineTo(lx + 140, logoY + 116); ctx.stroke();

// Main headline
const hlY = logoY + 152;
ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, sans-serif';

// Headline line 1
const hl1Grad = ctx.createLinearGradient(lx, hlY - 36, lx + 460, hlY);
hl1Grad.addColorStop(0, '#ffffff');
hl1Grad.addColorStop(1, 'rgba(255,255,255,0.85)');
ctx.fillStyle = hl1Grad;
ctx.fillText('AI Operating', lx, hlY);

// Headline line 2
ctx.fillText('System', lx, hlY + 52);

// Teal accent on "System"
const tGrad = ctx.createLinearGradient(lx, hlY + 16, lx + 250, hlY + 52);
tGrad.addColorStop(0, '#06B6D4');
tGrad.addColorStop(1, '#3B82F6');
ctx.fillStyle = tGrad;
ctx.fillText('for Artists', lx, hlY + 104);

// Subtext
ctx.font = '400 13px -apple-system, BlinkMacSystemFont, sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.35)';
ctx.fillText('Campaigns  ·  Releases  ·  Fan Intelligence', lx, hlY + 138);
ctx.fillText('Revenue  ·  Growth Automation', lx, hlY + 158);

// === FEATURE PILLS (bottom left) ===
const pY = H - 80;
const pills = [
  { text: 'Rocksteady A&R',  color: '#06B6D4' },
  { text: 'Release OS',      color: '#10B981' },
  { text: 'Campaign Engine', color: '#8B5CF6' },
  { text: 'Fan Intel',       color: '#F59E0B' },
];
let px = lx;
pills.forEach(p => {
  const tw = ctx.measureText(p.text).width;
  const pw = tw + 24;
  roundRect(ctx, px, pY, pw, 26, 6, p.color + '15', p.color + '30');
  ctx.font = '600 10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = p.color;
  ctx.fillText(p.text, px + 12, pY + 17);
  px += pw + 10;
});

// === SIGNAL LINES (decorative) ===
ctx.save();
ctx.globalAlpha = 0.15;
for (let i = 0; i < 6; i++) {
  const sy = 200 + i * 60;
  const lineGrad = ctx.createLinearGradient(lx + 400, sy, lx + 560, sy);
  lineGrad.addColorStop(0, 'transparent');
  lineGrad.addColorStop(0.5, '#06B6D4');
  lineGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lx + 400, sy);

  let x = lx + 400;
  let y = sy;
  const segments = 8;
  for (let s = 0; s < segments; s++) {
    x += 20;
    y += (Math.random() - 0.5) * 16;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}
ctx.restore();

// === EDGE GLOW TOP ===
const topGlow = ctx.createLinearGradient(0, 0, W, 0);
topGlow.addColorStop(0,    'rgba(6,182,212,0)');
topGlow.addColorStop(0.3,  'rgba(6,182,212,0.06)');
topGlow.addColorStop(0.7,  'rgba(59,130,246,0.06)');
topGlow.addColorStop(1,    'rgba(59,130,246,0)');
ctx.fillStyle = topGlow;
ctx.fillRect(0, 0, W, 2);

// === FOOTER BAR ===
const footerGrad = ctx.createLinearGradient(0, H - 1, W, H - 1);
footerGrad.addColorStop(0,   'rgba(6,182,212,0)');
footerGrad.addColorStop(0.4, 'rgba(6,182,212,0.3)');
footerGrad.addColorStop(0.6, 'rgba(59,130,246,0.3)');
footerGrad.addColorStop(1,   'rgba(59,130,246,0)');
ctx.fillStyle = footerGrad;
ctx.fillRect(0, H - 1, W, 1);

// Helper
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke && stroke !== 'transparent') { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore();
}

// Export
const outDir = join(__dirname, '../public/og');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'artist-os-preview.jpg');
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
writeFileSync(outPath, buffer);
console.log('Generated:', outPath, `(${Math.round(buffer.length / 1024)}KB)`);
