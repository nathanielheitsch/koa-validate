'use strict';

const request = require('supertest');
const appFactory = require('./appFactory.js');
const {delDir} = require('../utils/file.util');

require('should');

describe('koa-validate', function() {
  it('file sanitizers', (done) => {
    var app = appFactory.create(1);
    app.router.post('/upload', (ctx, next) => {
      ctx.checkFile('file').notEmpty().copy(__dirname + '/tmp/tempdir/', function(file, context) {});
      ctx.checkFile('empty').empty();
      ctx.checkFile('file').empty().contentTypeMatch(/^application\//);
      ctx.checkFile('file1').empty().move(__dirname + '/tmp/temp/', function(file, context) {
      });
      ctx.checkFile('file').notEmpty();
      ctx.checkFile('file').notEmpty().copy(__dirname + '/tmp/tempdir/', function(file, context) {
      });
      ctx.checkFile('file').notEmpty().copy(__dirname + '/tmp/');
      ctx.checkFile('file').notEmpty().copy(function() { return __dirname + '/tmp/temp/'; });
      ctx.checkFile('file').notEmpty().fileNameMatch(/^.*.js$/).size(0, 10 * 1024).suffixIn(['js']);

      delDir(`${__dirname}/tmp`);

      if (ctx.errors) {
        ctx.body = ctx.errors;
        return next();
      }
      ctx.body = 'ok';
      return next();
    });

    request(app.listen())
      .post('/upload')
      .attach('file', __dirname + '/test_checkFile.js')
      .attach('file1', __dirname + '/test_checkFile.js')
      .send({type: 'js'})
      .expect(200)
      .expect('ok', done);
  });

  it('file validators', function(done) {
    var app = appFactory.create(1);
    app.router.post('/upload', (ctx, next) => {
      ctx.checkFile('empty').notEmpty();
      ctx.checkFile('file0').size(10, 10);
      ctx.checkFile('file').size(1024 * 100, 1024 * 1024 * 10);
      ctx.checkFile('file1').size(1024 * 100, 1024 * 1024 * 1024 * 10);
      ctx.checkFile('file2').suffixIn(['png']);
      ctx.checkFile('file3').contentTypeMatch(/^image\/.*$/);
      ctx.checkFile('file4').contentTypeMatch(/^image\/.*$/);
      ctx.checkFile('file5').fileNameMatch(/\.png$/);
      ctx.checkFile('file6').isImageContentType('not image content type.');

      if (ctx.errors.length === 9) {
        ctx.body = 'ok';
        next();
      } else {
        ctx.body = 'not ok';
        next();
      }

    });

    request(app.listen())
      .post('/upload')
      .attach('file', __dirname + '/test_checkFile.js')
      .attach('file0', __dirname + '/test_checkFile.js')
      .attach('file1', __dirname + '/test_checkFile.js')
      .attach('file2', __dirname + '/test_checkFile.js')
      .attach('file3', __dirname + '/test_checkFile.js')
      .attach('file4', __dirname + '/test_checkFile.js')
      .attach('file5', __dirname + '/test_checkFile.js')
      .attach('file5', __dirname + '/test_checkFile.js')
      .attach('file6', __dirname + '/test_checkFile.js')
      .expect(200)
      .expect('ok', done);
  });
});
