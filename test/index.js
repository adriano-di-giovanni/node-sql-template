/* global describe */
/* global before */
/* global it */
/* global expect */

'use strict';

var
  path = require('path');

var
  chai = require('chai');

global.expect = chai.expect;

var
  SQLTemplate = require('../lib/SQLTemplate');

describe('Unit tests', function () {

  var
    template;

  describe('w/o connection', function () {
    before(function () {

      var
        options = {
          template: {
            dir: path.resolve(__dirname, './sql'),
            ext: 'sql'
          }
        };

      template = SQLTemplate.forge(options);
    });

    it('#render', function () {

      var
        sql = template.render('1', [ 1 ]);

      expect(sql.trim()).to.equal('SELECT 1');
    });

    it('#run w/ callback', function (done) {

      template.run('1', [ 1 ], function (error, rows) {
        expect(error).to.be.an.instanceOf(Error);
        done();
      });
    });
  });

  describe('w/ connection', function () {

    before(function () {

      var
        options = {
          template: {
            dir: path.resolve(__dirname, './sql'),
            ext: 'sql'
          },
          connection: require('./connection.json')
        };

      template = SQLTemplate.forge(options);
    });

    it('#run w/o callback', function (done) {

      var
        Readable = require('stream').Readable;

      var
        stream = template.run('2', [ 1 ]);

      expect(stream).to.be.an.instanceOf(Readable);

      stream
        .on('end', function () {
          done();
        });
    });

    it('#run w/ callback', function (done) {

      template.run('2', [ 1 ], function (error, rows) {
        expect(error).to.be.null;
        expect(rows).to.be.instanceOf(Array);
        done();
      });
    });

    it('#run w/ callback w/o escape', function (done) {

      template.run('2', function (error, rows) {
        expect(error).to.be.instanceOf(Error);
        done();
      });
    });
  });
});
