import { useEffect, useRef, useState } from 'react';
import { PAGES } from '../../../config/pages.js';
import { stack } from '../../../data/profile.js';
import { site } from '../../../config/site.js';
import { SKINS, SKIN_AUTO, isSkinId, lockedMode, skinById } from '../../../config/skins.js';
import { chooseSkin, getChoice, getSkin, isUnlocked } from '../../../lib/skin.js';
import { spotMove } from '../../../lib/dom.js';
import { has, motionSleep as sleep, prefersReducedMotion } from '../../../lib/env.js';
import { observeOnce } from '../../../lib/observe.js';
import { useStatus } from '../../../lib/status.js';
import { siteDateTime } from '../../../lib/siteTime.js';
import { BATTERY_CELLS, levelOf, unlockKonami } from '../../../lib/social.js';
import { useLang } from '../../../context/LangContext.jsx';
import './Terminal.css';

const { id } = site;
const HIRE = `hire ${id}`;
const TABS = PAGES.map((p) => p.id);

const pad = (s, n) => s + ' '.repeat(Math.max(1, n - s.length));
const modeNote = (s) => (s.modes.length > 1 ? 'dark+light' : `${s.modes[0]} only`);

function themeCmd(arg) {
  const [first = '', ...rest] = arg.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!first) {
    const now = getChoice() === SKIN_AUTO ? `auto (${getSkin()})` : getSkin();
    return [`skin: ${now}`, 'theme list | theme set <name> | theme random | theme auto   (or press Ctrl+K)'];
  }
  if (first === 'list' || first === 'ls') {
    const cur = getChoice();
    const rows = [`${cur === SKIN_AUTO ? '*' : ' '} ${pad('auto', 13)}follows the time of day`];
    for (const s of SKINS) {
      const locked = s.unlock && !isUnlocked(s.id);
      rows.push(`${cur === s.id ? '*' : ' '} ${pad(s.id, 13)}${locked ? `[locked] ${s.unlock.hint}` : modeNote(s)}}`);
    }
    return [rows.join('\n')];
  }
  if (first === 'random') {
    const pool = SKINS.filter((s) => isUnlocked(s.id) && s.id !== getSkin());
    const s = pool[Math.floor(Math.random() * pool.length)];
    chooseSkin(s.id);
    return [`-> ${s.id}`];
  }
  const target = (first === 'set' || first === 'use' ? rest : [first, ...rest]).join('-');
  if (!target) return ['theme: set what? try theme list'];
  if (target === SKIN_AUTO) {
    chooseSkin(SKIN_AUTO);
    return ['-> auto (changes with the time of day)'];
  }
  if (!isSkinId(target)) return [`theme: ${target}: no such skin - try theme list`];
  const s = skinById(target);
  if (!isUnlocked(target)) return [`theme: ${target} is locked - ${s.unlock.hint}`];
  chooseSkin(target);
  const lock = lockedMode(target);
  return [`-> ${target}${lock ? ` (${lock} only: the torch switch is locked)` : ''}}`];
}

function execCmd(raw, { onNavigate, clear, lang, dict }) {
  const [cmd = '', ...args] = raw.trim().split(/\s+/);
  const arg = args.join(' ');
  const dir = arg.replace('/', '');

  const files = {
    'mood.txt': dict.terminal.mood,
    'tea.txt': dict.terminal.teaLine,
    'stack.txt': stack.join('  '),
  };

  switch (cmd) {
    case '':
      return [];
    case 'help':
      return [dict.terminal.help, dict.terminal.helpHint];
    case 'whoami':
      return [dict.terminal.whoami];
    case 'ls':
      return [Object.keys(files).join('  ') + TABS.map((t) => `  ${t}/`).join('')];
    case 'cat':
      return [has(files, arg) ? files[arg] : `cat: ${arg || '?'}: ${lang === 'tr' ? 'Böyle bir dosya veya dizin yok' : 'No such file or directory'}`];
    case 'cd':
      if (TABS.includes(dir)) {
        onNavigate?.(dir);
        return [`-> ${dir}/`];
      }
      if (dir === '..' || dir === '~') {
        onNavigate?.('home');
        return ['-> ~/'];
      }
      return [`cd: ${arg}: ${lang === 'tr' ? 'böyle bir dizin yok' : 'no such directory'}`];
    case 'clear':
      clear();
      return [];
    case 'date':
      return [siteDateTime()];
    case 'battery': {
      const lvl = levelOf();
      const n = Math.round((lvl / 100) * BATTERY_CELLS);
      const bar = '='.repeat(n) + '-'.repeat(BATTERY_CELLS - n);
      return [`social battery: [${bar}] ${lvl}%`];
    }
    case 'theme':
    case 'skin':
      return themeCmd(arg);
    case 'konami':
      unlockKonami();
      return ['-> konami activated'];
    case 'sudo':
      if (arg.trim() === HIRE || arg.trim() === `hire`) {
        return [dict.terminal.hireResp];
      }
      return [`sudo: ${arg}: command not found`];
    default:
      return [`bash: ${cmd}: ${lang === 'tr' ? 'komut bulunamadı. "help" yazarak seçenekleri görün.' : 'command not found. Type "help" for options.'}`];
  }
}

export default function Terminal({ onNavigate }) {
  const status = useStatus();
  const { dict, lang } = useLang();
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const termRef = useRef(null);
  const inputRef = useRef(null);
  const hasAppeared = useRef(false);

  const intro = [
    { cmd: 'whoami', out: dict.terminal.whoami },
    { cmd: 'cat mood.txt', out: dict.terminal.mood },
    { cmd: 'echo $STATUS', out: `${status.key} - ${lang === 'tr' ? 'keşfetmek için "help" yazın' : 'type help to play around'}` },
  ];

  useEffect(() => {
    return observeOnce(
      termRef.current,
      () => {
        hasAppeared.current = true;
        (async () => {
          setTyping(true);
          for (const item of intro) {
            await sleep(prefersReducedMotion() ? 50 : 250);
            setHistory((prev) => [...prev, { cmd: item.cmd, out: item.out }]);
          }
          setTyping(false);
        })();
      },
      0.15
    );
  }, [lang]);

  const run = (cmdStr) => {
    if (!cmdStr.trim()) return;
    const out = execCmd(cmdStr, {
      onNavigate,
      clear: () => setHistory([]),
      lang,
      dict,
    });
    setHistory((prev) => [...prev, { cmd: cmdStr, out: out.join('\n') }]);
    setInput('');
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    run(input);
  };

  return (
    <div
      ref={termRef}
      onMouseMove={spotMove}
      className="spot bg-inset border border-line rounded-[10px] overflow-hidden font-mono text-[13px] shadow-lg"
    >
      <div className="bg-panel px-4 py-2 border-b border-line flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-line" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-line" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-line" />
        </span>
        <span className="text-dim text-[11px]">{site.host}:~</span>
        <span className="text-dim text-[11px]">bash</span>
      </div>

      <div className="p-4 max-h-[380px] overflow-y-auto space-y-2">
        {history.map((h, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 text-amber">
              <span className="text-dim">{site.id}@{site.host}:~$</span>
              <span>{h.cmd}</span>
            </div>
            {h.out && <div className="text-ink pl-4 whitespace-pre-wrap leading-relaxed">{h.out}</div>}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 text-amber pt-1">
          <span className="text-dim shrink-0">{site.id}@{site.host}:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={typing}
            className="bg-transparent border-none outline-none text-ink w-full focus:ring-0 p-0 text-[13px]"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-line bg-panel/50 px-4 py-2.5 flex flex-wrap gap-2 items-center">
        <span className="text-dim text-[11px] mr-1">{lang === 'tr' ? 'Hızlı sor:' : 'Quick:'}</span>
        {dict.terminal.quick.map(([label, cmd]) => (
          <button
            key={cmd}
            type="button"
            onClick={() => run(cmd)}
            className="px-2 py-0.5 rounded border border-line bg-panel text-[11.5px] text-dim hover:text-amber hover:border-amber transition-colors cursor-pointer"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
