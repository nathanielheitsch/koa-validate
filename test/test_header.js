'use strict';

const request = require('supertest');
const appFactory = require('./appFactory.js');
require('should');

describe('Header Actions', function() {
  var app;
  var server;
  this.beforeEach(function() {
    app = appFactory.create(1);
    server = app.listen();
  });
  afterEach(function() {
    server.close();
  });
  it('check header', function(done) {
    app.router.get('/header', (ctx, next) => {
      ctx.checkHeader('int').notEmpty().isInt();
      if (ctx.errors) {
        ctx.status = 500;
        return next();
      }
      ctx.status = 200;
      return next();
    });
    request(server)
      .get('/header')
      .set('int', '1')
      .query().expect(200, done);
  });

});
