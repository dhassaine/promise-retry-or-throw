# promise-retry-or-throw
Simple wrapper for retrying a promise

## Installation

`$ npm install promise-retry-or-throw`

## Usage
`import promiseRetry from 'promise-retry-or-throw';`

### promiseRetry(fn, [options])
Call `fn` promise until it resolves or the maximum number of retries is reached (or the rejected promise matches a given early termination filter).

## Options
  - `maxNumberOfRetries` : Maximum number of attempts to be made before giving up. Default is `10`
  - `delayIncrease` : Time increase between each retry (in milliseconds). Default is `1000`
  - `filter` : An error filter to allow early termination, e.g. for unrecoverable errors. Default is `() => false`
  - `calculateDelay` : A function for calculating the delay between each retry attempt. Default is to increment last delay by `delayIncrease`

## Simplest use case:
```
const action = () => Promise.resolve(data);
promiseRetry(action)
  .then(response => assert.deepEqual(response, data));
```

## Early termination
Some errors should be treated as unrecoverable and a retry should not be attempted. An optional `filter` function can be passed in which is expected to return a truthy value for an early termination.
```
const action = () => Promise.reject('test');

const options = {
  filter: (error) => error == 'test'
}

return promiseRetry(action, options)
  .then(() => {
    throw new Error('promiseRetry should not have resolved')
  })
  .catch(error => assert.equal(error, 'test'));
```

## User defined delay strategy
```
const customDelayIncrease = ({delay, delayIncrease}) => {
  return delay * delayIncrease;
}

const options = {
  maxNumberOfRetries: 40
  delayIncrease: 10,
  calculateDelay: customDelayIncrease
};

return promiseRetry(action, options);
```

