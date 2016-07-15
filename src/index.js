
const defaultOptions = {
    maxNumberOfRetries: 10,
    delayIncrease: 1000,
    filter: () => false,
    calculateDelay: defaultCalculateDelay
};

export default function retryOrThrow(actionPromise, options = {}) {
    const {
        maxNumberOfRetries,
        delayIncrease,
        filter,
        calculateDelay
    } = Object.assign({}, defaultOptions, options);

    let delay = delayIncrease;
    let numberOfRetries = 1;

    return new Promise((resolve, reject) => {
        action();

        function action(data) {
            actionPromise()
                .then((response) => resolve(response))
                .catch(error => {
                    if (filter(error)) {
                        return reject(error);
                    }
                    if (numberOfRetries >= maxNumberOfRetries) {
                        return reject(new Error('reject: too many failed attempts'));
                    }

                    delay = calculateDelay({delay, delayIncrease});
                    numberOfRetries++;
                    setTimeout(() => action(), delay);
                })
                .catch(reject);
        }
    });
}


function defaultCalculateDelay({delay, delayIncrease}) {
    return delay + delayIncrease;
}
