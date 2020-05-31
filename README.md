koa2-ctx-validator
============

[![Build Status](https://travis-ci.org/nathanielheitsch/koa2-ctx-validator.svg?branch=master)](https://travis-ci.org/nathanielheitsch/koa2-ctx-validator) [![Coverage Status](https://coveralls.io/repos/github/nathanielheitsch/koa2-ctx-validator/badge.svg?branch=master)](https://coveralls.io/github/nathanielheitsch/koa2-ctx-validator?branch=master)

Koa2 request formatter and validator.
Forked from [Koa1 version](https://github.com/RocksonZeta/koa2-ctx-validator) by [RocksonZeta](https://github.com/RocksonZeta).

## Installation
```
$ npm install koa2-ctx-validator --save
```

## Basic usage:
```javascript
'use strict';
var koa = require('koa');
var app = koa();
var router = require('koa-router')();
require('koa2-ctx-validator')(app);

app.use(require('koa-body')({multipart:true , formidable:{keepExtensions:true}}));
app.use(router.routes()).use(router.allowedMethods());
router.post('/signup', (ctx, next) => {
	//optional() means this param may not in the params.
	ctx.checkBody('name').optional().len(2, 20,"name is too long");
	ctx.checkBody('email').isEmail("invalid email");
	ctx.checkBody('password').notEmpty().len(3, 20).md5();
	//empty() mean this param can be a empty string.
	ctx.checkBody('nick').optional().empty().len(3, 20);
	//also we can get the sanitized value 
	var age = ctx.checkBody('age').toInt().value;
	yield ctx.checkFile('icon').notEmpty().size(0,300*1024,'file too large').move("/static/icon/" , function*(file,context){
		//resize image
	});
	if (ctx.errors) {
		ctx.body = ctx.errors;
		return;
	}
});
router.get('/users', (ctx, next) => {
	ctx.checkQuery('department').empty().in(["sale","finance"], "does not support this department!").len(3, 20);	
	ctx.checkQuery('name').empty().len(2,20,"bad name.").trim().toLow();
	ctx.checkQuery('age').empty().gt(10,"too young!").lt(30,"to old!").toInt();
	if (ctx.errors) {
		ctx.body = ctx.errors;
		return;
	}
});
router.get('/user/:id', (ctx, next) => {
	ctx.checkParams('id').toInt(0);
	if (ctx.errors) {
		ctx.body = ctx.errors;
		return;
	}
});
//json body,we can check it using [json path](https://github.com/flitbit/json-path)(like xpath)
router.post('/json' , (ctx, next) => {
	ctx.checkBody('/store/book[0]/price').get(0).eq(8.95);
	ctx.checkBody('#/store/book[0]/category').first().trim().eq('reference');
	if (ctx.errors) {
		ctx.body = ctx.errors;
		return;
	}
})

app.listen(3000);
```

## API

[Documentation Here](https://nathanielheitsch.github.io/koa2-ctx-validator/)

## How to extends validate:

```javascript
var Validator = require('koa2-ctx-validator').Validator;
// to do what you want to.
//you can use this.key ,this.value,this.params,this.context,this.exists
//use addError(tip) , if you meet error.
```