import {assert} from 'chai';
import promiseRetry from '../src/promiseRetry';

describe('promise-retry-or-throw', function () {
    it('works', function () {
        const action = () => Promise.resolve();

        return promiseRetry(action);

        
    });

    it('works 2', function () {
        const action = () => Promise.reject();

        return promiseRetry(action);

        
    });
});
