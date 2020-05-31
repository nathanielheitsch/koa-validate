'use strict';

const request = require('supertest');
const appFactory = require('./appFactory.js');
require('should');

describe('Nobody Actions', function() {
  var app;
  var server;
  this.beforeEach(function() {
    app = appFactory.create(1);
    server = app.listen();
  });
  afterEach(function() {
    server.close();
  });
  it('nobody to check', function(done) {
    app.router.post('/nobody', (ctx, next) => {
      ctx.checkBody('body').notEmpty();
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(server);
    req.post('/nobody')
      .send()
      .expect(500, done);
  });

});
