import { type GetTimesResult } from 'suncalc';
import { getPrevNext } from "../index";

const makeGetTimes = (now = Date.now()) => {
  return (date: Date, latitude: number, longitude: number): GetTimesResult => ({
    sunrise: new Date(now - 3000),
    sunriseEnd: new Date(now - 2000),
    goldenHourEnd: new Date(now - 1000),
    solarNoon: new Date(now + 1000),
    goldenHour: new Date(now + 2000),
    sunsetStart: new Date(now + 3000),
    sunset: new Date(now + 4000),
    dusk: new Date(now + 5000),
    nauticalDusk: new Date(now + 5100),
    night: new Date(now + 5200),
    nadir: new Date(now + 5300),
    nightEnd: new Date(now + 5400),
    nauticalDawn: new Date(now + 5500),
    dawn: new Date(now + 5600),
  });
}

const relativeGetTimes = (date: Date, latitude: number, longitude: number): GetTimesResult => ({
  sunrise: new Date(date.getTime() - 3000),
  sunriseEnd: new Date(date.getTime() - 2000),
  goldenHourEnd: new Date(date.getTime() - 1000),
  solarNoon: new Date(date.getTime() + 1000),
  goldenHour: new Date(date.getTime() + 2000),
  sunsetStart: new Date(date.getTime() + 3000),
  sunset: new Date(date.getTime() + 4000),
  dusk: new Date(date.getTime() + 5000),
  nauticalDusk: new Date(date.getTime() + 6000),
  night: new Date(date.getTime() + 7000),
  nadir: new Date(date.getTime() + 8000),
  nightEnd: new Date(date.getTime() + 9000),
  nauticalDawn: new Date(date.getTime() + 10000),
  dawn: new Date(date.getTime() + 11000),
});


test('Previous and next times', () => {
  const getTimes = makeGetTimes();
  const { prev, next } = getPrevNext(0, 0, getTimes)
  expect(prev[0]).toBe('goldenHourEnd');
  expect(next[0]).toBe('solarNoon');
});

test('Previous and next times (filtered)', () => {
  const { prev, next } = getPrevNext(0, 0, relativeGetTimes, new Date(), ['solarNoon'])
  expect(prev[0]).toBe('solarNoon');
  expect(next[0]).toBe('solarNoon');
  expect(prev[1].getTime()).toBeLessThan(next[1].getTime());
});

test('Previous and next times in advance (zero time difference)', () => {
  const getTimes = makeGetTimes();
  const now = Date.now() + 3000;
  const { prev, next } = getPrevNext(0, 0, getTimes, new Date(now))
  expect(prev[0]).toBe('goldenHour');
  expect(next[0]).toBe('sunsetStart');
});

test('Previous and next times in advance', () => {
  const getTimes = makeGetTimes();
  const now = Date.now() + 3001;
  const { prev, next } = getPrevNext(0, 0, getTimes, new Date(now))
  expect(prev[0]).toBe('sunsetStart');
  expect(next[0]).toBe('sunset');
});
