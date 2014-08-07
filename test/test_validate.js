'use strict';

var koa = require('koa'),
request = require('supertest');


function create_app(){
	var app = koa();
	app.use(require('koa-body')());
	app.use(require('../lib/validate.js')());
	app.use(require('koa-router')(app));
	return app;
}

describe('koa-validate' , function(){
	it("these validates should be to ok" , function(done){
		var app = create_app();
		app.post('/validate',function*(){
			this.checkBody('optional').optional().len(3,20);
			this.checkBody('name').notEmpty().len(3,20);
			this.checkBody('empty').empty();
			this.checkBody('match').match(/^abc$/i);
			this.checkBody('integer').isInt(/^abc$/i);
			this.checkBody('float_').isFloat();
			this.checkBody('in').in([1,2]);
			this.checkBody('eq').eq("eq");
			this.checkBody('neq').neq("eq");
			this.checkBody('contains').contains("tain");
			this.checkBody('notContains').contains(" ");
			this.checkBody('email').isEmail();
			this.checkBody('url').isUrl();
			this.checkBody('ip').isIp();
			this.checkBody('alpha').isAlpha();
			this.checkBody('numeric').isNumeric();
			this.checkBody('an').isAlphanumeric();
			this.checkBody('base64').isBase64();
			this.checkBody('hex').isHexadecimal();
			this.checkBody('color1').isHexColor();
			this.checkBody('color2').isHexColor();
			this.checkBody('color3').isHexColor();
			this.checkBody('color4').isHexColor();
			this.checkBody('low').isLowercase();
			this.checkBody('up').isUppercase();
			this.checkBody('div').isDivisibleBy(3);
			this.checkBody('n').isNull();
			this.checkBody('len').isLength(1,4);
			this.checkBody('byteLenght').isByteLength(4,6);
			this.checkBody('uuid').isUUID();
			this.checkBody('date').isDate();
			this.checkBody('after').isAfter(new Date("2014-08-06"));
			this.checkBody('before').isBefore(new Date("2014-08-08"));
			this.checkBody('in').isIn();
			this.checkBody('credit').isCreditCard();
			this.checkBody('isbn').isISBN();
			this.checkBody('json').isJSON();
			this.checkBody('mb').isMultibyte();
			this.checkBody('ascii').isAscii();
			this.checkBody('fw').isFullWidth();
			this.checkBody('hw').isHalfWidth();
			this.checkBody('vw').isVariableWidth();
			this.checkBody('sp').isSurrogatePair();
			if(this.errors){
				this.body = this.errors;
				 return;
			}
			if(8 !== this.request.body.age){
					this.body= 'failed';
			}
			this.body= 'ok';
		});
		var req = request(app.listen());

		req.post('/validate')
		.send({
			name:"jim",
			empty:"",
			email:"jim@gmail.com",
			len:"len",
			match:"abc",
			integer:12,
			float_:1.23,in:1,
			eq:"eq",
			neq:'neq',
			contains:"contains" , 
			notContains:"notContains",
			url:"http://www.google.com",
			ip:'192.168.1.1',
			alpha:"abxyABXZ",
			numeric:"3243134",
			an:"a1b2c3",
			base64:"aGVsbG8=",
			hex:"0a1b2c3ef",
			color1:"#ffffff",
			color2:"ffffff",
			color3:"#fff",
			color4:"fff",
			low:"hello",
			up:"HELLO",
			div:"21",
			n:"",
			byteLenght:"你好",
			uuid:"c8162b90-fdda-4803-843b-ed5851480c86",
			date:"2014-08-07",
			after:"2014-08-07",
			before:"2014-08-07",
			credit:"4063651340421805",
			isbn:"9787513300711",
			json:'{"a":1}',
			mb:"多字节",
			ascii:"fff",
			fw:"宽字节",
			hw:"a字节",
			vw:"v多字节",
			sp:'ABC千𥧄1-2-3'
		})
		.expect(200)
		.expect('ok' ,done);
	});

	
	it('there validate query should be to okay' , function(done){
		var app = create_app();
		app.get('/query',function*(){
			this.checkQuery('name').notEmpty();
			this.checkQuery('password').len(3,20);
			if(this.errors){
				this.body = this.errors;
				 return;
			}
			this.body = 'ok';
		});
		request(app.listen())
		.get('/query')
		.query({
			name:'jim',
			password:'yeap'
		}).expect(200)
		.expect('ok' , done);
	});
	it('there validate params should be to okay' , function(done){
		var app = create_app();
		app.get('/:id',function*(){
			console.log(this.params)
			this.checkParams('id').isInt();
			if(this.errors){
				this.body = this.errors;
				 return;
			}
			this.body = 'ok';
		});
		request(app.listen())
		.get('/123')
		.expect(200)
		.expect('ok' , done);
	});	
	it('there sanitizers should be to okay' , function(done){
		var app = create_app();
		app.post('/sanitizers',function*(){
			this.checkBody('int_').toInt();
			this.checkBody('float_').toFloat();
			//console.log(this.request.body)
			if(this.errors){
				this.body = this.errors;
				 return;
			}
			if(20 !== this.request.body.int_ ){
				this.throw(500);
			}
			if(1.2 !== this.request.body.float_ ){
				this.throw(500);
			}
			this.body = 'ok';
		});
		request(app.listen())
		.post('/sanitizers')
		.send({
			int_:'20',
			float_:'1.2'
		}).expect(200)
		.expect('ok' , done);
	});
});

