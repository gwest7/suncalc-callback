
A utility to [SunCalc](https://github.com/mourner/suncalc#sunlight-times). SunCalc provides `Date` values for a specific date and geolocation.

This library assists with a more procedural approaches.

## Usage

To get the next and previous sunlight events use `getPrevNext`.

```js
const { prev, next } = getPrevNext(new Date(), lat, lon, getTimes);
const [prevName, prevDate] = prev;
const [nextName, nextDate] = next;
console.log(`${prevName} was at ${prevDate.toTimeString()}`)
console.log(`${nextName} will be at ${nextDate.toTimeString()}`)
```
