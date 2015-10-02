'use strict';

var
  _ = require('underscore');

function Config(options) {

  if ( ! _.isObject(options)) {
    throw new Error('Wrong type for argument 1, options. Object expected.');
  }

  if ( ! options.template) {
    throw new Error('Can\'t find a valid template configuration');
  }

  var
    template = options.template;

  this._dir = template.dir || './sql';
  this._ext = '.'+(template.ext.replace(/^\.+/ig, '') || 'sql');
  this._connection = options.connection;
  this._isDebug = !! options.isDebug;
}

Config.forge = function (options) {
  return new this(options);
};

Config.prototype.getDir = function () {
  return this._dir;
};

Config.prototype.getExt = function () {
  return this._ext;
};

Config.prototype.getConnection = function () {
  return this._connection;
};

Config.prototype.isDebug = function () {
  return this._isDebug;
};

module.exports = Config;
