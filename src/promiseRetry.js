
const defaultOptions = {
  maxNumberOfRetries: 10,
  delayIncrease: 1000,
  filter: () => false
};

export default function retryOrThrow(actionPromise, options = {}) {
  const {
    maxNumberOfRetries,
    delayIncrease,
    filter
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

          incrementAttempt();
          setTimeout(() => action(), delay);
        })
        .catch(reject);
    }

    function incrementAttempt() {
      delay += delayIncrease;
      numberOfRetries++;
    }
  });
}

