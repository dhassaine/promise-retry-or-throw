# promise-retry-or-throw
Simple wrapper for retrying a promise

## Usage
### promiseRetry(fn, [options])
Call `fn` promise until it resolves or the maximum number of retries is reached (or the rejected promise matches a given early termination filter).

## Options
  - `maxNumberOfRetries` : Maximum number of attempts to be made before giving up. Default is `10`
  - `delayIncrease` : Time increase between each retry (in milliseconds). Default is `1000`
  - `filter` : An error filter to allow early termination, e.g. for unrecoverable errors. Default is `() => false`

## Simplest use case:
```
const action = () => Promise.resolve(data);
promiseRetry(action)
  .then(response => assert.deepEqual(response, data));
```

