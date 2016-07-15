import {assert} from 'chai';
import promiseRetry from '../src/index';

describe('promise-retry-or-throw', function () {
    it('Immediately resolves if action is successful', function () {
        const action = () => Promise.resolve();
        return promiseRetry(action);
    });

    it('Can succeed after a few attempts', function () {
        this.timeout(0);
        const options = {
            maxNumberOfRetries: 4,
            delayIncrease: 1
        }

        let attempt = 0;
        return promiseRetry(makeThreeAttempts, options)
            .then(() => assert.equal(attempt, 3));

        function makeThreeAttempts() {
            attempt++;
            return attempt == 3 ? Promise.resolve() : Promise.reject();
        }
    });

    it('Actions on some data are returned correctly', function () {
        const data = [0, 1, 2];
        const action = () => Promise.resolve(data);
        return promiseRetry(action)
            .then(response => assert.deepEqual(response, data));
    });

    it('Can throw early if given an error filter function', function () {
        const action = () => Promise.reject('test');
        const options = {
            filter: (error) => error == 'test'
        }

        return promiseRetry(action, options)
            .then(() => {
                throw new Error('promiseRetry should not have resolved')
            })
            .catch(error => assert.equal(error, 'test'));
    });

    describe('time delay calculation', function () {
        it("default delay function should increase linearly on each retry attempt", function () {
            const options = {
                maxNumberOfRetries: 40,
                delayIncrease: 10
            };

            let start = Date.now();
            let delay = 0;
            let attempts = 0;
            const action = () => {
                attempts++;
                const now = Date.now();
                assert.equal(now >= start + delay, true);
                delay += options.delayIncrease;
                start = now;
                return attempts > 5 ? Promise.resolve() : Promise.reject();
            };

            return promiseRetry(action, options);
        });

        it("a user defined delay strategy can be used", function () {
            const doubleDelayIncrease = ({delay, delayIncrease}) => {
                return delay + (delayIncrease * 2);
            }

            const options = {
                maxNumberOfRetries: 40,
                delayIncrease: 10,
                calculateDelay: doubleDelayIncrease
            };

            let start = Date.now();
            let delay = 0;
            let attempts = 0;
            const action = () => {
                attempts++;
                const now = Date.now();
                assert.equal(now >= start + delay, true);
                delay += (options.delayIncrease * 2);
                start = now;
                return attempts > 5 ? Promise.resolve() : Promise.reject();
            };

            return promiseRetry(action, options);
        });

    });
});
