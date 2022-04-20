import { type GetTimesResult } from 'suncalc';

export type TimeName = keyof GetTimesResult;

/**
 * Get the previous and next sunight times.
 * @param latitude Earth geolocation latitude where the times are relevant.
 * @param longitude Earth geolocation longitude where the times are relevant.
 * @param getTimes The `SunCalc.getTimes` function (https://github.com/mourner/suncalc#sunlight-times).
 * @param date Any future or past date. Default is `new Date()`.
 * @param onlyFor Optionally limit the sunlight events. If your array is empty don't call this function.
 * @returns The last and upcoming sunlight times.
 */
export function getPrevNext(
  latitude: number,
  longitude: number,
  getTimes: (date: Date, latitude: number, longitude: number) => GetTimesResult,
  date: Date = new Date(),
  onlyFor?: TimeName[],
) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  let list = [
    getTimes(new Date(y, m, d, -12), latitude, longitude),
    getTimes(new Date(y, m, d, 12), latitude, longitude),
    getTimes(new Date(y, m, d, 36), latitude, longitude),
  ].map(times => Object.entries(times) as [TimeName, Date][]).flat().sort((a,b) => a[1].getTime() - b[1].getTime());
  if (onlyFor?.length) list = list.filter(t => onlyFor.includes(t[0]))
  const now = date.getTime();
  // list.forEach(t => console.log(`${t[0]}: ${t[1].getTime() - now} @ ${t[1].toLocaleTimeString()}`))
  const idx = list.findIndex(t => (t[1].getTime() - now) >= 0);
  return {
    prev: list[idx - 1],
    next: list[idx], // could be right now (current millisecond)
  }
}

/**
 * Making use of the `SunCalc.getTimes` function, creates a promise with the next sunlight time.
 * @param latitude Earth geolocation latitude where the times are relevant.
 * @param longitude Earth geolocation longitude where the times are relevant.
 * @param getTimes The `SunCalc.getTimes` function (https://github.com/mourner/suncalc#sunlight-times).
 * @param msInAdvance If the promise should be called in advance then set a time in milliseconds.
 * @returns A promise that will resolve with the next sunlight time.
 */
 export function nextTime(
  latitude: number,
  longitude: number,
  getTimes: (date: Date, latitude: number, longitude: number) => GetTimesResult,
  msInAdvance = 0,
) {
  return new Promise<[TimeName, Date]>((resolve) => {
    const now = Date.now() + msInAdvance
    const { next } = getPrevNext(latitude, longitude, getTimes, new Date(now));
    const t = next[1].getTime() - now;
    // console.log('next',t);
    setTimeout(() => resolve(next), t);
  })
}

/**
 * Making use of the `SunCalc.getTimes` function, allows a function to be called with each sunlight time.
 * @param latitude Earth geolocation latitude where the times are relevant.
 * @param longitude Earth geolocation longitude where the times are relevant.
 * @param getTimes The `SunCalc.getTimes` function (https://github.com/mourner/suncalc#sunlight-times).
 * @param cb The callback function to be called when a sunlight time is reached.
 * @param msInAdvance If callbacks should be called in advance then set a time in milliseconds.
 * @returns A function that if called terminates the calling of the callback function.
 */
export function onTimes(
  latitude: number,
  longitude: number,
  getTimes: (date: Date, latitude: number, longitude: number) => GetTimesResult,
  cb:(timeName:TimeName,date:Date) => void,
  msInAdvance = 0,
) {
  let timer: ReturnType<typeof setTimeout>;
  const setNext = () => {
    const now = Date.now() + msInAdvance
    const { next } = getPrevNext(latitude, longitude, getTimes, new Date(now));
    const t = next[1].getTime() - now;
    // console.log('next', t, next[0]);
    timer = setTimeout(() => {
      try {
        cb( ...next );
      } catch (error) {
        console.warn('onTimes callback failed:');
        console.error(error);
      }
      setNext();
    }, t + 1); // prevent fast machines from taking less than a millisecond to setup the next timeout
  }
  setNext();

  return () => {
    clearTimeout(timer);
  }
}

