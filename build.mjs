// Generates index.html (Script first) and midi/index.html (Midi first) from src/.
// Run: node build.mjs   (no dependencies)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const SITE = 'https://happyprivate.github.io/HAPPYprivate/';
const rd = (f) => readFileSync(new URL('./src/' + f, import.meta.url), 'utf8');
const [layout, script, midi, tail] = ['layout', 'script', 'midi', 'tail'].map((n) => rd(n + '.html'));
const routes = {
  '': { order: [script, midi], route: 'script', canon: SITE, base: '',
    title: 'HAPPY Script — Free Roblox Scripts',
    desc: 'HAPPY Script offers free Roblox scripts with one-click copy and a Discord community. Also home to HAPPY Midi, music and MIDI software.' },
  'midi/': { order: [midi, script], route: 'midi', canon: SITE + 'midi/', base: '../',
    title: 'HAPPY Midi — Music Creation & MIDI Software',
    desc: 'HAPPY Midi: Sheet Studio, Happy Macro, Generate and Check Display for MIDI. Create, edit and play music in games with a piano system.' }
};
for (const [dir, r] of Object.entries(routes)) {
  const secs = r.order.map((s, i) => s.replace(/<hx/g, `<h${i ? 2 : 1}`).replace(/<\/hx>/g, `</h${i ? 2 : 1}>`)
    .replace('class="sec ', i ? 'class="sec ' : 'class="sec sec-first '));
  const nav = (r.route === 'script'
    ? '<a href="#script">Script</a><a href="#midi">Midi</a>' : '<a href="#midi">Midi</a><a href="#script">Script</a>');
  const html = layout.replace('{{SECTIONS}}', secs.join('\n') + '\n' + tail).replace('{{NAV}}', nav)
    .replace(/\{\{TITLE\}\}/g, r.title).replace(/\{\{DESC\}\}/g, r.desc).replace(/\{\{CANON\}\}/g, r.canon)
    .replace(/\{\{SITE\}\}/g, SITE).replace(/\{\{ROUTE\}\}/g, r.route).replace(/\{\{HOME\}\}/g, r.base || './')
    .replace(/\{\{BASE\}\}/g, r.base);
  if (dir) mkdirSync(new URL('./' + dir, import.meta.url), { recursive: true });
  writeFileSync(new URL('./' + dir + 'index.html', import.meta.url), html);
  console.log('built', dir || '/');
}
