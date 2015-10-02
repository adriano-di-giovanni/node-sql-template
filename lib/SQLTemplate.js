'use strict';

var
  path = require('path'),
  fs = require('fs'),
  Readable = require('readable-stream');

var
  _ = require('underscore'),
  mysql = require('mysql');

var
  Config = require('./types/Config');

function _getTemplate(filename) {

  var
    /* jshint validthis: true */
    config = this._config,

    dir = config.getDir(),
    ext = config.getExt(),

    template = this._template,

    filepath;

  filename = path.basename(filename, ext)+ext;

  if ( ! template[filename]) {
    filepath = path.join(dir, filename);
    template[filename] = fs.readFileSync(filepath, { encoding: 'utf8' });
  }

  return template[filename];
}

function _query(sql, done) {

  var
    /* jshint validthis: true */
    pool = this._pool,
    stream;

  if ( ! _.isFunction(done)) {

    stream = new Readable({ objectMode: true });

    // it'll be overridden. please, see below.
    stream._read = function () {};

    stream
      .on('data', function (data) {
        stream.emit('result', data);
      });
  }

  pool.getConnection(function (error, connection) {

    var
      release = _.once(function () {
        connection.release();
      });

    if (error) {
      done(error);
      return;
    }

    if (stream) {

      stream._read = function () {
        if (connection) {
          connection.resume();
        }
      };

      connection.query(sql)
        .on('error', function () {

          release();

          var
            args = [ 'error' ].concat(_.toArray(arguments));

          stream.emit.apply(stream, args);
        })
        .on('fields', function () {

          var
            args = [ 'fields' ].concat(_.toArray(arguments));

          stream.emit.apply(stream, args);
        })
        .on('result', function (row) {

          if ( ! stream.push(row)) { connection.pause(); }
        })
        .on('end', function () {

          stream.push(null);
          release();
        });
    } else {

      /* eslint no-shadow: 0 */
      connection.query(sql, function (error, rows) {
        release();
        done(error, rows);
      });
    }
  });

  return stream;
}

function SQLTemplate(options) {

  var
    config = this._config = Config.forge(options),
    connection = config.getConnection(),
    pool;

  if (connection) {

    pool = this._pool = mysql.createPool(config.getConnection());

    process.once('exit', function () {
      if (pool) {
        pool.end();
      }
    });
  }

  this._template = {};
}

SQLTemplate.forge = function (options) {
  return new this(options);
};

SQLTemplate.prototype.run = function (filename, escape, done) {

  if (_.isFunction(escape)) {
    done = escape;
    escape = null;
  }

  if ( ! this._pool) {
    if (_.isFunction(done)) { done(new Error('Invalid call.')); }
    return void 0;
  }

  var
    sql = this.render(filename, escape);

  if (this._config.isDebug()) {
    console.log(sql);
  }

  return _query.call(this, sql, done);
};

SQLTemplate.prototype.render = function (filename, escape) {

  escape = escape || [];

  var
    template = _getTemplate.call(this, filename),
    sql = mysql.format(template, escape);

  return sql;
};

SQLTemplate.prototype.end = function () {
  this._pool.end();
};

module.exports = SQLTemplate;
