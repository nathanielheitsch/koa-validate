'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const Body = require('koa-body');

exports.create = function(type) {
  const app = new Koa();
  const router = new Router();
  if (type == 1) {
    app.use(new Body({ multipart: true, formidable: { keepExtensions: true } }));
  } else {
    app.use(new Body());
  }
  require('../index.js')(app);
  app.use(function(ctx, next) {
    try {
      next();
    } catch (err) {
      console.log(err.stack);
      this.app.emit('error', err, this);
    }
  });
  app.use(router.routes())
    .use(router.allowedMethods());
  app.router = router;
  return app;
};
