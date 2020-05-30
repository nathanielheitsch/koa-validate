'use strict';

const request = require('supertest');
const appFactory = require('./appFactory.js');
require('should');

describe('koa2-ctx-validator', function() {
  it('bad uri decodeURIComponent should not to be ok', function(done) {
    var app = appFactory.create(1);
    app.router.post('/decodeURIComponent', (ctx, next) => {
      ctx.checkBody('uri').decodeURIComponent();
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(app.listen());
    req.post('/decodeURIComponent')
      .send({ uri: '%' })
      .expect(500, done);
  });
  it('bad uri decodeURI should not to be ok', function(done) {
    var app = appFactory.create(1);
    app.router.post('/decodeURI', (ctx, next) => {
      ctx.checkBody('uri').decodeURI();
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(app.listen());
    req.post('/decodeURI')
      .send({ uri: '%' })
      .expect(500, done);
  });
  it('bad base64 string should not to be ok', function(done) {
    var app = appFactory.create(1);
    app.router.post('/decodeBase64', (ctx, next) => {
      ctx.checkBody('base64').decodeURIComponent();
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(app.listen());
    req.post('/decodeBase64')
      .send({ base64: '%%' })
      .expect(500, done);
  });
  it('bad int string should not to be ok', function(done) {
    var app = appFactory.create(1);
    app.router.post('/toInt', (ctx, next) => {
      ctx.checkBody('v').toInt();
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(app.listen());
    req.post('/toInt')
      .send({ v: 'gg' })
      .expect(500, done);
  });

  it('0 len should be ok', function(done) {
    var app = appFactory.create(1);
    app.router.post('/len', (ctx, next) => {
      ctx.checkBody('v').len(0, 1);
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(app.listen());
    req.post('/len')
      .send({ v: '' })
      .expect(200, done);
  });
});
