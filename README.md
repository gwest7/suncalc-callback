
A callback/promise approach to [SunCalc](https://github.com/mourner/suncalc#sunlight-times). SunCalc provides `Date` values for a specific date and geolocation.

The `getTimes` function is passed as a parameter where needed to make it possible to isolate different instances of the SunCalc library.

This library assists with a more procedural approaches.

## Usage

Setup a callback function to be called as sunlight events occur:

```js
import { getTimes } from 'suncalc';

onTimes(35.2029, -111.66485, getTimes, name => {
  console.log(`It is now ${name}`);
})
```

There is also a `Promise` based function.

```js
import { getTimes } from 'suncalc';

while (true) {
  const [name] = await nextTime(35.2029, -111.66485, getTimes);
  console.log(`It is now ${name}`);
}
```

If you need the callback to be called 5 minutes prior to every sunlight event an optional parameter can be used.

```js
onTimes(lat, lon, getTimes, (name, date) => {
  console.log(`${name} in 5 min. The time will then be ${date}`);
}, 1000 * 60 * 5)
```

Same for the promise.

```js
while (true) {
  const [name, date] = await nextTime(lat, lon, getTimes, 1000 * 60 * 5);
  console.log(`${name} in 5 min. The time will then be ${date}`);
}
```

To get the next and previous sunlight events use `getPrevNext`.

```js
const { prev, next } = getPrevNext(new Date(), lat, lon, getTimes);
const [prevName, prevDate] = prev;
const [nextName, nextDate] = next;
console.log(`${prevName} was at ${prevDate.toTimeString()}`);
console.log(`${nextName} will be at ${nextDate.toTimeString()}`);
```

To filter the sunlight events of `getPrevNext` an optional parameter may be used.

```js
const { prev, next } = getPrevNext(new Date(), lat, lon, getTimes, ['solarNoon']);
const [prevName, prevDate] = prev;
const [nextName, nextDate] = next;
console.log(`Pervious solar noon was at ${prevDate.toTimeString()}`);
console.log(`Next solar noon will be at ${nextDate.toTimeString()}`);
```

Optionally with `rxjs` you can use `observeTimes`.

```js
observeTimes(lat, lon, getTimes).subscriber(([name,date]) => {
  console.log(`It is now ${name}`);
})
```