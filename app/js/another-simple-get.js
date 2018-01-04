export default function(url, options = {}) {
  const request = new XMLHttpRequest();
  request.open(options.method || 'GET', url, true);
  const callbacks = options.callbacks || { };
  Object.keys(callbacks).forEach(key => {
    request[`on${key}`] = (...args) => {
      callbacks[key].call(null, request, ...args);
    };
  });
  request.send();
}
