const debounce = (fun, delay = 1000) => {
  let timeout;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fun.apply(null, args);
    }, delay);
  };
};
