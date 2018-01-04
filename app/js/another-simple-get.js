function myRequest(url, options = {}) {
  const request = new XMLHttpRequest();
  request.open(options.method | 'GET', url, true);
  const callbacks = options.callbacks || { };
  Object.keys(callbacks).forEach(key => {
    request.addEventListener(key, function() {
      callbacks[key].call(null, this, ...arguments);
    });
  });
  request.open();
}
