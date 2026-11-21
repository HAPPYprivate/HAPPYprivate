// Generates separate HAPPY Script and HAPPY Midi pages from src/.
// Run: node build.mjs (no dependencies)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const SITE = 'https://happyprivate.github.io/HAPPYprivate/';
const rd = (name) => readFileSync(new URL('./src/' + name, import.meta.url), 'utf8');
const [layout, script, midi, scriptTail, midiTail] = [
  'layout.html', 'script.html', 'midi.html', 'script-tail.html', 'midi-tail.html'
].map(rd);
const scriptData = '<script id="scriptContent" type="text/plain">loadstring(game:HttpGet("https://happyscript.happy37135535.workers.dev/"))()</script>';
const routes = {
  '': {route:'script', canon:SITE, base:'', home:'./', scriptUrl:'./', midiUrl:'midi/',
    title:'HAPPY Script — Roblox Script Service',
    desc:'HAPPY Script is a script service designed for use with Roblox exploits. Get service updates, report bugs, and share feedback.',
    sections:[script,scriptTail], scriptData},
  'script/': {route:'script', canon:SITE, base:'../', home:'../', scriptUrl:'./', midiUrl:'../midi/',
    title:'HAPPY Script — Roblox Script Service',
    desc:'HAPPY Script is a script service designed for use with Roblox exploits. Get service updates, report bugs, and share feedback.',
    sections:[script,scriptTail], scriptData},
  'midi/': {route:'midi', canon:SITE+'midi/', base:'../', home:'../', scriptUrl:'../', midiUrl:'./',
    title:'HAPPY Midi — Music Creation & MIDI Software',
    desc:'HAPPY Midi brings together Sheet Studio, Happy Macro, Generate, and Check Display for MIDI.',
    sections:[midi,midiTail], scriptData:''}
};
for (const [dir, route] of Object.entries(routes)) {
  const sections = route.sections.map((section,index) => {
    const level = index === 0 ? 1 : 2;
    return section.replace(/<hx/g,'<h'+level).split('</hx>').join('</h'+level+'>')
      .replace('class="sec ',index === 0 ? 'class="sec sec-first ' : 'class="sec ');
  }).join('\n');
  const nav = '<a href="'+route.scriptUrl+'"'+(route.route === 'script' ? ' aria-current="page"' : '')+'>HAPPY Script</a>'
    + '<a href="'+route.midiUrl+'"'+(route.route === 'midi' ? ' aria-current="page"' : '')+'>HAPPY Midi</a>';
  const values = {
    '{{SECTIONS}}':sections,'{{NAV}}':nav,'{{SCRIPT_DATA}}':route.scriptData,
    '{{TITLE}}':route.title,'{{DESC}}':route.desc,'{{CANON}}':route.canon,
    '{{SITE}}':SITE,'{{ROUTE}}':route.route,'{{HOME}}':route.home,'{{BASE}}':route.base,
    '{{SCRIPT_URL}}':route.scriptUrl,'{{MIDI_URL}}':route.midiUrl
  };
  let html = layout;
  for (const [key,value] of Object.entries(values)) html = html.replaceAll(key,value);
  if (dir) mkdirSync(new URL('./'+dir,import.meta.url),{recursive:true});
  writeFileSync(new URL('./'+dir+'index.html',import.meta.url),html);
  console.log('built',dir || '/');
}
