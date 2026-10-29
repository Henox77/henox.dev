import { useEffect, useRef, useState } from 'react';
import { storageKey } from '../../../../config/site.js';
import { readBest, saveBest } from '../../../../lib/storage.js';
import { pausableInterval } from '../../../../lib/timers.js';
import { Pixels } from '../shared/Pixels.jsx';
import useBubble from '../shared/useBubble.js';
import useKeepOnScreen from '../shared/useKeepOnScreen.js';
import usePetLife from '../shared/usePetLife.js';
import Zzz from '../shared/Zzz.jsx';
import './Rabbit.css';

const ROWS = [
  '......XX.XX.....',
  '......XX.XX.....',
  '......XX.XX.....',
  '......XXXXXX....',
  '.....XXXXEXXX...',
  '.....XXXXXXXXN..',
  '.XXX..XXXXXX....',
  'XXXXXXXXXXXXX...',
  'XXXXXXXXXXXXXX..',
  'XXXXXXXXXXXXXX..',
  '.XXXXXXXXXXXX...',
  '..XX.XX..XX.XX..',
  '..XX.XX..XX.XX..',
];
const COLORS = { X: '#e9fff0', E: '#00380e', N: '#ff4d6d' };
const NAP_COLORS = { ...COLORS, E: '#e9fff0' };
const KEY_PILLS = storageKey('matrix-pills');
const GLYPHS = ['ｱ', 'ﾊ', 'ﾐ', 'ﾘ', 'ｦ', 'ｹ', 'ﾓ', 'ｼ', 'ﾇ', 'ｳ'];
const WAKE = ['wake up...', 'the matrix has you.', 'follow the white rabbit.'];
const BLUE = ['the story ends. believe whatever you want.', 'you wake up in your bed. nothing happened.', 'ignorance is bliss. enjoy it.'];
const TRAIL = Array.from({ length: 7 }, (_, i) => ({ g: GLYPHS[(i * 3) % GLYPHS.length], i }));

export default function Rabbit() {
  const [run, setRun] = useState(0);
  const [held, setHeld] = useState(false);
  const [choice, setChoice] = useState(false);
  const [diving, setDiving] = useState(false);
  const [wake, setWake] = useState(-1);
  const [deja, setDeja] = useState(false);
  const pills = useRef(readBest(KEY_PILLS));
  const asking = useRef(false);
  const blues = useRef(0);
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);
  const { text, say } = useBubble(2600);
  const [napText, setNapText] = useState('');
  const napRef = useRef(false);
  const choiceEl = useRef(null);
  const bubbleEl = useRef(null);
  useKeepOnScreen(choiceEl, [choice]);
  useKeepOnScreen(bubbleEl, [text]);

  const begin = (forceDeja) => {
    if (napRef.current) return;
    setDeja(forceDeja === true || Math.random() < 0.34);
    setRun((r) => (r % 2 ? r : r + 1));
  };
  useEffect(() => {
    const first = setTimeout(begin, 4000);
    const stop = pausableInterval(begin, () => 22000 + Math.random() * 20000, { onResume: () => {} });
    return () => {
      clearTimeout(first);
      stop();
    };
  }, []);

  const running = run % 2 === 1;
  const asleep = usePetLife((name) => {
    if (name === 'sleep') napRef.current = true;
    else if (name === 'wake') {
      napRef.current = false;
      setNapText('wake up, neo?');
      later(() => setNapText(''), 2200);
    } else if (napRef.current) {
      return;
    } else if (name === 'shake') {
      if (!running) begin();
      say('!!', 1200);
    } else if (name === 'navigate') {
      if (!running) begin(true);
    } else if (name === 'konami') {
      setWake(0);
      later(() => setWake(1), 1400);
      later(() => setWake(2), 2800);
      later(() => setWake(-1), 4300);
    } else if (name === 'copy') say('copied. or was it?', 2000);
  });
  useEffect(() => {
    if (!running || !deja) return undefined;
    const id = setTimeout(() => say('déjà vu.', 1900), 5100);
    return () => clearTimeout(id);
  }, [running, deja, run, say]);

  const ask = () => {
    if (held) return;
    asking.current = true;
    setHeld(true);
    setChoice(true);
    later(() => {
      if (!asking.current) return;
      asking.current = false;
      setChoice(false);
      setHeld(false);
      say('too slow.');
    }, 9000);
  };
  const choose = (red) => {
    asking.current = false;
    setChoice(false);
    if (red) {
      pills.current += 1;
      saveBest(KEY_PILLS, pills.current);
      setDiving(true);
      later(() => setWake(0), 750);
      later(() => setWake(1), 2150);
      later(() => setWake(2), 3550);
      later(() => {
        setWake(-1);
        setDiving(false);
        setHeld(false);
        setRun((r) => (r % 2 ? r + 1 : r));
      }, 5300);
    } else {
      say(BLUE[blues.current++ % BLUE.length], 3000);
      later(() => setHeld(false), 3100);
    }
  };

  const dir = Math.ceil(run / 2) % 2 ? 'rtl' : 'ltr';
  return (
    <>
      {(asleep || napText) && !running && (
        <div className="rabbit-nap">
          <Pixels rows={ROWS} colors={asleep ? NAP_COLORS : COLORS} px={3} />
          <Zzz show={asleep} />
          {napText && <div className="cameo-bubble rabbit-bubble">{napText}</div>}
        </div>
      )}
      {running && (
        <div
          key={run}
          className={`rabbit-run rabbit-${dir} ${deja ? 'is-deja' : ''} ${held ? 'is-held' : ''} ${diving ? 'is-diving' : ''}`}
          onAnimationEnd={(e) => e.target === e.currentTarget && setRun((r) => r + 1)}>
          <div className="rabbit-trail" aria-hidden="true">
            {TRAIL.map((t) => (
              <span key={t.i} style={{ '--i': t.i }}>
                {t.g}
              </span>
            ))}
          </div>
          <button type="button" className="rabbit-hit" onClick={ask} aria-label="the white rabbit. Click it to be offered a pill">
            <Pixels rows={ROWS} colors={COLORS} px={3} className="rabbit-sprite" />
          </button>
          {diving && <i className="rabbit-hole" aria-hidden="true" />}
          {choice && (
            <div ref={choiceEl} className="cameo-bubble rabbit-choice" role="group" aria-label="choose a pill">
              <span>choose.</span>
              <button type="button" className="rabbit-pill is-red" onClick={() => choose(true)}>red pill</button>
              <button type="button" className="rabbit-pill is-blue" onClick={() => choose(false)}>blue pill</button>
            </div>
          )}
          {text && !choice && <div ref={bubbleEl} className="cameo-bubble rabbit-bubble">{text}</div>}
        </div>
      )}
      {wake >= 0 && (
        <div className="rabbit-wake" role="status">
          <p key={wake} style={{ '--len': WAKE[wake].length }}>{WAKE[wake]}</p>
          {wake === 2 && <small>red pills taken: {pills.current}</small>}
        </div>
      )}
    </>
  );
}
