var format = require('util').format,
    once = require('once'),
    check = require('./check-response');

module.exports = function(deis) {
  /**
   * scale an application
   */
  function scale(appName, configuration, callback) {
    callback = once(callback);
    if (!isObject(keyValues)) {
      return callback(new Error('To scale pass an object with the type as key'));
    }

    var uri = format('/%s/apps/%s/scale/', deis.version, appName);
    deis.client.post(uri, configuration, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(204, res, body, callback);
      callback(null);
    });
  }

  /**
   * list application containers and their status
   */
  function list(appName, callback) {
    var uri = format('/%s/apps/%s/containers/', deis.version, appName);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }
  return {
    list: list,
    scale: scale
  };
};
