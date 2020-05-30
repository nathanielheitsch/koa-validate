'use strict';

const request = require('supertest');
const appFactory = require('./appFactory.js');
require('should');

describe('Header Actions', function() {
  it('check header', function(done) {
    var app = appFactory.create(1);
    app.router.get('/header', (ctx, next) => {
      ctx.checkHeader('int').notEmpty().isInt();
      if (ctx.errors) {
        ctx.status = 500;
        return next();
      }
      ctx.status = 200;
      return next();
    });
    request(app.listen())
      .get('/header')
      .set('int', '1')
      .query().expect(200, done);
  });

});
