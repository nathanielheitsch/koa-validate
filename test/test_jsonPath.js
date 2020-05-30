'use strict';

var data = {
  store: {
    book: [
      {
        category: 'reference',
        author: 'Nigel Rees',
        title: 'Sayings of the Century',
        price: 8.95,
        publishDate: '2015-01-01',
        disabled: false
      },
      {
        category: 'fiction',
        author: 'Evelyn Waugh',
        title: 'Sword of Honour',
        price: 12.99
      },
      {
        category: 'fiction',
        author: 'Herman Melville',
        title: 'Moby Dick',
        isbn: '0-553-21311-3',
        price: 8.99
      },
      {
        category: 'fiction',
        author: 'J. R. R. Tolkien',
        title: 'The Lord of the Rings',
        isbn: '0-395-19395-8',
        price: 22.99
      }
    ],
    bicycle: {
      color: 'red',
      price: 19.95
    }
  }
};

const request = require('supertest');
const appFactory = require('./appFactory.js');
require('should');

describe('koa2-ctx-validator', function() {
  it('json path basic', function(done) {
    var app = appFactory.create(1);
    app.router.post('/json', (ctx, next) => {
      ctx.checkBody('/', true).notEmpty();
      ctx.checkBody('/store/bicycle/color', true).exist();
      ctx.checkBody('/store/book[0]/price', true).get(0).eq(8.95);
      ctx.checkBody('/store/book[0]/price', true).get(0).isFloat().eq(8.95);
      ctx.checkBody('/store/book[0]/disabled', true).first().notEmpty().toBoolean();
      ctx.checkBody('#/store/book[0]/category', true).first().trim().eq('reference');
      ctx.checkBody('/store/book[*]/price', true).filter(function(v, k, o) {
        return v > 10;
      }).first().gt(10);
      if (ctx.errors) {
        // console.log(ctx.errors)
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(app.listen());
    req.post('/json')
      .send(data)
      .expect(200, done);
  });

});

describe('koa2-ctx-validator type', function() {
  it('type check', function(done) {
    var app = appFactory.create(1);
    app.router.post('/json', (ctx, next) => {
      ctx.checkBody('/', true).notEmpty();
      ctx.checkBody('/store/book[0]/price', true).get(0).type('number').type('primitive');
      ctx.checkBody('/store/book[0]/price', true).get(0).type('hello'); // should warn
      ctx.checkBody('#/store/book[0]/category', true).first().type('string');
      ctx.checkBody('/store/book[*]/price', true).type('array');
      ctx.checkBody('/store/book[0]/publishDate', true).get(0).toDate().type('date').type('object');
      if (ctx.errors) {
        ctx.status = 500;
      } else {
        ctx.status = 200;
      }
    });
    var req = request(app.listen());
    req.post('/json')
      .send(data)
      .expect(200, done);
  });
  it('type fail check', function(done) {
    var app = appFactory.create(1);
    app.router.post('/json', (ctx, next) => {
      ctx.checkBody('/', true).type('null');
      ctx.checkBody('/store/book[0]/price', true).get(0).type('string');
      ctx.checkBody('#/store/book[0]/category', true).first().type('null');
      ctx.checkBody('/store/book[*]/price', true).type('nullorundefined');
      ctx.checkBody('/store/book[0]/publishDate', true).first().toDate().type('array');
      // console.log(ctx.errors)
      if (ctx.errors && ctx.errors.length == 5) {
        ctx.status = 200;
      } else {
        ctx.status = 500;
      }
    });
    var req = request(app.listen());
    req.post('/json')
      .send(data)
      .expect(200, done);
  });
});
