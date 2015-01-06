var request = require('request-json'),
    format = require('util').format,
    check = require('./check-response'),
    once = require('once'),
    debug = require('debug')('deis:apps');

module.exports = function(deis) {

  /**
   * Create a new application
   */
  function create(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/', deis.version);
    deis.client.post(uri, {
      id: appName
    },function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(201, res, body, callback);
      debug('create [%s] %s', appName, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * List accessible applications
   */
  function list(callback) {
    callback = once(callback);
    var uri = format('/%s/apps/', deis.version);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * View info about an application
   */
  function info(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/', deis.version, appName);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      debug('info [%s] %s', appName, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * View aggregated application logs
   */
  function logs(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/logs/', deis.version);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      debug('logs [%s]\n%s', appName, body);
      callback(null, body);
    });
  }

  /**
   * Run a command in an ephemeral app container
   */
  function run(appName, command, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/run/', deis.version, appName);
    deis.client.post(uri, {
      command: command
    }, function(err, res, body) {
      check.forError(err, callback);
      debug('run [%s "%s"] %s', appName, command, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * Destroy an application
   */
  function destroy(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/', deis.version, appName);
    deis.client.del(uri, function(err, res, body) {
      check.forError(err, callback);
      debug('destroy [%s] %s', appName, res.statusCode);
      callback(null, body);
    });
  }

  return {
    create: create,
    list: list,
    info: info,
    logs: logs,
    run: run,
    destroy: destroy
  };
};