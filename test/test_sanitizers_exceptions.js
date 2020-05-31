'use strict';

const request = require('supertest');
const appFactory = require('./appFactory.js');
require('should');

describe('Sanitizer Exception Actions', function() {
  var app;
  var server;
  this.beforeEach(function() {
    app = appFactory.create(1);
    server = app.listen();
  });
  afterEach(function() {
    server.close();
  });
  it('bad uri decodeURIComponent should not to be ok', function(done) {
    app.router.post('/decodeURIComponent', (ctx, next) => {
      ctx.checkBody('uri').decodeURIComponent();
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(server);
    req.post('/decodeURIComponent')
      .send({ uri: '%' })
      .expect(500, done);
  });
  it('bad uri decodeURI should not to be ok', function(done) {
    app.router.post('/decodeURI', (ctx, next) => {
      ctx.checkBody('uri').decodeURI();
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(server);
    req.post('/decodeURI')
      .send({ uri: '%' })
      .expect(500, done);
  });
  it('bad base64 string should not to be ok', function(done) {
    app.router.post('/decodeBase64', (ctx, next) => {
      ctx.checkBody('base64').decodeURIComponent();
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(server);
    req.post('/decodeBase64')
      .send({ base64: '%%' })
      .expect(500, done);
  });
  it('bad int string should not to be ok', function(done) {
    app.router.post('/toInt', (ctx, next) => {
      ctx.checkBody('v').toInt();
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(server);
    req.post('/toInt')
      .send({ v: 'gg' })
      .expect(500, done);
  });

  it('0 len should be ok', function(done) {
    app.router.post('/len', (ctx, next) => {
      ctx.checkBody('v').len(0, 1);
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(server);
    req.post('/len')
      .send({ v: '' })
      .expect(200, done);
  });
});
