
const defaultOptions = {
    numberOfRetries: 1,
    maxNumberOfRetries: 3,
    delay: 1000,
    delayIncrease: 1000,
    filter: () => false
};

export default function retryOrThrow(actionPromise, options=Object.assign({}, defaultOptions) ) {

  return new Promise((resolve, reject) => {
    action();

    function action(data) {
      actionPromise()
        .then((response) => resolve(response))
        .catch(error => {
          if (options.filter(error)) {
            return reject(new Error('reject message: Error matched filter'));
          }
          if (options.numberOfRetries >= options.maxNumberOfRetries) {
            return reject(new Error('reject message: too many failed attempts'));
          }

          incrementAttempt();
          console.log('trying again');
          setTimeout(() => action(), options.delay);
        })
        .catch(reject);
    }

    function incrementAttempt() {
      options.delay += options.delayIncrease;
      options.numberOfRetries++;
    }
  });
}

