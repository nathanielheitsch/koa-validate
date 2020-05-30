const appFactory = require('./appFactory.js');
const app = appFactory.create(1);

app.router.post('/upload', async(ctx, next) => {
  console.log(ctx);
  console.log(ctx.request.body);
  console.log(ctx.request.files);
  ctx.checkFile('empty').empty();
  ctx.status = 200;
  ctx.body = 'yay';
  await next();
});
app.listen(80);
