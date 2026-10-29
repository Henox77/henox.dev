import { site } from '../config/site.js';

const { timezone, schedule } = site;

const hourFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: timezone,
  hour: 'numeric',
  hourCycle: 'h23',
});
function siteHour() {
  return parseInt(hourFmt.format(new Date()), 10);
}

const clockFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: timezone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});
export const siteClock = () => clockFmt.format(new Date());

const offsetFmt = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'shortOffset' });
export const gmtLabel = () => offsetFmt.formatToParts(new Date()).find((p) => p.type === 'timeZoneName')?.value ?? '';

export const siteDateTime = () => new Date().toLocaleString('en-GB', { timeZone: timezone });

export function timeOfDay(h = siteHour()) {
  if (h >= schedule.night || h < schedule.dawn) return 'night';
  if (h < schedule.day) return 'dawn';
  if (h < schedule.dusk) return 'day';
  return 'dusk';
}

export const isOnlineHour = (h = siteHour()) => h >= schedule.day && h < schedule.night;
