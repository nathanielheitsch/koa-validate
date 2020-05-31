'use strict';

const request = require('supertest');
const appFactory = require('./appFactory.js');
require('should');

describe('Validate Actions', function() {
  var app;
  var server;
  this.beforeEach(function() {
    app = appFactory.create(1);
    server = app.listen();
  });
  afterEach(function() {
    server.close();
  });
  it('these validates should be to ok', function(done) {
    app.router.post('/validate', (ctx, next) => {
      ctx.checkBody('optional').optional().len(3, 20);
      ctx.checkBody('optional').optional().len(1, 100).trim().toInt();
      ctx.checkBody('optionalInt').optional().len(1, 100).trim().toInt();
      ctx.checkBody('name').notEmpty().len(3, 20);
      ctx.checkBody('empty').empty();
      ctx.checkBody('notBlank').notBlank();
      ctx.checkBody('match').match(/^abc$/i);
      ctx.checkBody('notMatch').notMatch(/^xyz$/i);
      ctx.checkBody('ensure').ensure(true);
      ctx.checkBody('ensureNot').ensureNot(false);
      ctx.checkBody('integer').isInt();
      ctx.checkBody('integer').isInt(null, { min: 12 });
      ctx.checkBody('integer').isInt(null, { max: 12 });
      ctx.checkBody('integer').isInt(null, { min: 12, max: 12 });
      ctx.checkBody('stringInteger').isInt();
      ctx.checkBody('stringInteger').isInt(null, { min: 12 });
      ctx.checkBody('stringInteger').isInt(null, { max: 12 });
      ctx.checkBody('stringInteger').isInt(null, { min: 12, max: 12 });
      ctx.checkBody('float_').isFloat();
      ctx.checkBody('in').in([1, 2]);
      ctx.checkBody('eq').eq('eq');
      ctx.checkBody('neq').neq('eq');
      ctx.checkBody('number4').gt(3);
      ctx.checkBody('number4').lt(5);
      ctx.checkBody('number4').ge(4);
      ctx.checkBody('number4').le(4);
      ctx.checkBody('number4').ge(3);
      ctx.checkBody('number4').le(5);
      ctx.checkBody('contains').contains('tain');
      ctx.checkBody('notContains').notContains(' ');
      ctx.checkBody('email').isEmail();
      ctx.checkBody('url').isUrl();
      ctx.checkBody('ip').isIp();
      ctx.checkBody('alpha').isAlpha();
      ctx.checkBody('numeric').isNumeric();
      ctx.checkBody('an').isAlphanumeric();
      ctx.checkBody('base64').isBase64();
      ctx.checkBody('hex').isHexadecimal();
      ctx.checkBody('color1').isHexColor();
      ctx.checkBody('color2').isHexColor();
      ctx.checkBody('color3').isHexColor();
      ctx.checkBody('color4').isHexColor();
      ctx.checkBody('low').isLowercase();
      ctx.checkBody('up').isUppercase();
      ctx.checkBody('div').isDivisibleBy(3);
      ctx.checkBody('n').isNull();
      ctx.checkBody('len').isLength(1, 4);
      ctx.checkBody('byteLenght').isByteLength(4, 6);
      ctx.checkBody('uuid').isUUID();
      ctx.checkBody('date').isDate();
      ctx.checkBody('time').isTime();
      ctx.checkBody('after').isAfter('2014-08-06');
      ctx.checkBody('before').isBefore('2014-08-08');
      ctx.checkBody('in').isIn();
      ctx.checkBody('credit').isCreditCard();
      ctx.checkBody('isbn').isISBN();
      ctx.checkBody('json').isJSON();
      ctx.checkBody('mb').isMultibyte();
      ctx.checkBody('ascii').isAscii();
      ctx.checkBody('fw').isFullWidth();
      ctx.checkBody('hw').isHalfWidth();
      ctx.checkBody('vw').isVariableWidth();
      ctx.checkBody('sp').isSurrogatePair();
      ctx.checkBody('currency').isCurrency();
      ctx.checkBody('dataUri').isDataURI();
      ctx.checkBody('mobilePhone').isMobilePhone(null, 'zh-CN');
      ctx.checkBody('iso8601').isISO8601();
      ctx.checkBody('mac').isMACAddress();
      ctx.checkBody('isin').isISIN();
      ctx.checkBody('fqdn').isFQDN();
      if (ctx.errors) {
        ctx.body = ctx.errors;
        return;
      }
      if (ctx.request.body.age !== 8) {
        ctx.body = 'failed';
      }
      ctx.body = 'ok';
    });

    request(server)
      .post('/validate')
      .send({
        optionalInt: '100',
        name: 'jim',
        empty: '',
        notBlank: '\t h\n',
        email: 'jim@gmail.com',
        len: 'len',
        match: 'abc',
        notMmatch: 'abc',
        ensure: '',
        ensureNot: '',
        integer: 12,
        stringInteger: '12',
        float_: 1.23,
        in: 1,
        eq: 'eq',
        neq: 'neq',
        number4: '4',
        contains: 'contains',
        notContains: 'notContains',
        url: 'http://www.google.com',
        ip: '192.168.1.1',
        alpha: 'abxyABXZ',
        numeric: '3243134',
        an: 'a1b2c3',
        base64: 'aGVsbG8=',
        hex: '0a1b2c3ef',
        color1: '#ffffff',
        color2: 'ffffff',
        color3: '#fff',
        color4: 'fff',
        low: 'hello',
        up: 'HELLO',
        div: '21',
        n: '',
        byteLenght: '你好',
        uuid: 'c8162b90-fdda-4803-843b-ed5851480c86',
        time: '13:12:00',
        date: '2014-08-07',
        after: '2014-08-07',
        before: '2014-08-07',
        credit: '4063651340421805',
        isbn: '9787513300711',
        json: '{"a":1}',
        mb: '多字节',
        ascii: 'fff',
        fw: '宽字节',
        hw: 'a字节',
        vw: 'v多字节',
        sp: 'ABC千𥧄1-2-3',
        currency: '$12',
        dataUri: 'data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E',
        mobilePhone: '13800000000',
        iso8601: '2004-05-03',
        mac: 'C8:3A:35:CC:ED:80',
        isin: 'US0378331005',
        fqdn: 'www.google.com'
      })
      .expect(200)
      .expect('ok', done);
  });

  it('these validates fail tests should be to ok', function(done) {
    server.close();
    app = appFactory.create();
    server = app.listen();
    app.router.post('/validate', (ctx, next) => {
      ctx.checkBody('name').notEmpty().len(3, 20);
      ctx.checkBody('notEmpty').notEmpty();
      ctx.checkBody('blank').notBlank();
      ctx.checkBody('notEmpty').len(2, 3);
      ctx.checkBody('match').match(/^abc$/i);
      ctx.checkBody('integer').isInt();
      ctx.checkBody('integer2').isInt(null, { min: 101 });
      ctx.checkBody('integer2').isInt(null, { max: 99 });
      ctx.checkBody('integer2').isInt(null, { min: 1, max: 99 });
      ctx.checkBody('float_').isFloat();
      ctx.checkBody('in').in([1, 2]);
      ctx.checkBody('eq').eq('eq');
      ctx.checkBody('neq').neq('eq');
      ctx.checkBody('number4').gt(5);
      ctx.checkBody('number4').lt(3);
      ctx.checkBody('number4').ge(5);
      ctx.checkBody('number4').le(3);
      ctx.checkBody('contains').contains('tain');
      ctx.checkBody('notContains').notContains(' ');
      ctx.checkBody('email').isEmail();
      ctx.checkBody('url').isUrl();
      ctx.checkBody('ip').isIp();
      ctx.checkBody('alpha').isAlpha();
      ctx.checkBody('numeric').isNumeric();
      ctx.checkBody('an').isAlphanumeric();
      ctx.checkBody('base64').isBase64();
      ctx.checkBody('hex').isHexadecimal();
      ctx.checkBody('color1').isHexColor();
      ctx.checkBody('color2').isHexColor();
      ctx.checkBody('color3').isHexColor();
      ctx.checkBody('color4').isHexColor();
      ctx.checkBody('low').isLowercase();
      ctx.checkBody('up').isUppercase();
      ctx.checkBody('div').isDivisibleBy(3);
      ctx.checkBody('n').isNull();
      ctx.checkBody('len').isLength(3, 4);
      ctx.checkBody('len1').isLength(3, 4);
      ctx.checkBody('byteLength').isByteLength(4, 6);
      ctx.checkBody('uuid').isUUID();
      ctx.checkBody('time').isTime();
      ctx.checkBody('date').isDate();
      ctx.checkBody('after').isAfter('2014-08-06');
      ctx.checkBody('before').isBefore('2014-08-02');
      ctx.checkBody('in').isIn([1, 2]);
      ctx.checkBody('credit').isCreditCard();
      ctx.checkBody('isbn').isISBN();
      ctx.checkBody('json').isJSON();
      ctx.checkBody('mb').isMultibyte();
      ctx.checkBody('ascii').isAscii();
      ctx.checkBody('fw').isFullWidth();
      ctx.checkBody('hw').isHalfWidth();
      ctx.checkBody('vw').isVariableWidth();
      ctx.checkBody('sp').isSurrogatePair();
      ctx.checkBody('currency').isCurrency();
      ctx.checkBody('dataUri').isDataURI();
      ctx.checkBody('mobilePhone').isMobilePhone(null, 'zh-CN');
      ctx.checkBody('iso8601').isISO8601();
      ctx.checkBody('mac').isMACAddress();
      ctx.checkBody('isin').isISIN();
      ctx.checkBody('fqdn').isFQDN();
      ctx.checkBody('fqdn1').isFQDN();
      if (ctx.errors.length === 61) {
        ctx.body = ctx.errors;
        ctx.body = 'ok';
        return;
      }
      ctx.body = 'only ' + ctx.errors.length + ' errors';
    });

    request(server).post('/validate')
      .send({
        name: 'j',
        empty: 'fd',
        blank: ' \n\r\f\t ',
        email: 'jim@@gmail.com',
        len: 'l',
        len1: 'length1',
        match: 'xyz',
        integer: '12a',
        integer2: '100',
        float_: 'a1.23',
        in: 'fd',
        eq: 'neq',
        neq: 'eq',
        number4: '4',
        contains: 'hello',
        notContains: 'h f',
        url: 'google',
        ip: '192.168.',
        alpha: '321',
        numeric: 'fada',
        an: '__a',
        base64: 'fdsaf',
        hex: 'hgsr',
        color1: '#fffff',
        color2: 'fffff',
        color3: '#ff',
        color4: 'ff',
        low: 'Hre',
        up: 're',
        div: '22',
        n: 'f',
        byteLength: '你',
        uuid: 'c8162b90-fdda-4803-843bed5851480c86',
        date: '2014-0807',
        time: '24:00:00',
        after: '2014-08-05',
        before: '2014-08-02',
        credit: '4063651340421805332',
        isbn: '978751330071154',
        json: '{"a:1}',
        mb: 'fd',
        ascii: '你好',
        fw: '43',
        hw: '你好',
        vw: 'aa',
        sp: 'fdfd',
        currency: '#12',
        dataUri: 'hello world',
        mobilePhone: '12000000000',
        iso8601: '2004503',
        mac: 'C8:3A:35:CC:ED:8Z',
        isin: 'hello',
        fqdn: 'http://www.x.com'
      })
      .expect(200)
      .expect('ok', done);
  });

  it('there validate query should be to okay', function(done) {
    server.close();
    app = appFactory.create();
    server = app.listen();
    app.router.get('/query', (ctx, next) => {
      ctx.checkQuery('name').notEmpty();
      ctx.checkQuery('password').len(3, 20);
      if (ctx.errors) {
        ctx.body = ctx.errors;
        return;
      }
      ctx.body = 'ok';
    });
    request(server)
      .get('/query')
      .query({
        name: 'jim',
        password: 'yeap'
      }).expect(200)
      .expect('ok', done);
  });
  it('there validate params should be to okay', function(done) {
    server.close();
    app = appFactory.create();
    server = app.listen();
    app.router.get('/:id', (ctx, next) => {
      ctx.checkParams('id').isInt();
      if (ctx.errors) {
        ctx.body = ctx.errors;
        return;
      }
      ctx.body = 'ok';
    });
    request(server)
      .get('/123')
      .expect(200)
      .expect('ok', done);
  });
  it('there sanitizers should be to okay', function(done) {
    var url = 'http://www.google.com/';
    app.router.post('/sanitizers', (ctx, next) => {
      ctx.checkBody('default').default('default');
      ctx.checkBody('int_').toInt();
      ctx.checkBody('int_').toInt(null, 10, { min: 20 });
      ctx.checkBody('int_').toInt(null, 10, { max: 20 });
      ctx.checkBody('int_').toInt(null, 10, { min: 20, max: 20 });
      ctx.checkBody('octal_').toInt(null, 8);
      ctx.checkBody('octal_').toInt(null, 8, { min: 8 });
      ctx.checkBody('octal_').toInt(null, 8, { max: 8 });
      ctx.checkBody('octal_').toInt(null, 8, { min: 8, max: 8 });
      ctx.checkBody('float_').toFloat();
      ctx.checkBody('bool').toBoolean();
      ctx.checkBody('falseValue').notEmpty('value is empty').toBoolean();
      ctx.checkBody('date').toDate();
      ctx.checkBody('trim').trim();
      ctx.checkBody('ltrim').ltrim();
      ctx.checkBody('rtrim').rtrim();
      ctx.checkBody('up').toUp();
      ctx.checkBody('low').toLow();
      ctx.checkBody('escape').escape();
      ctx.checkBody('stripLow').stripLow();
      ctx.checkBody('whitelist').whitelist('ll');
      ctx.checkBody('blacklist').blacklist('ll');
      ctx.checkBody('encodeURI').decodeURI();
      ctx.checkBody('decodeURI').encodeURI();
      ctx.checkBody('encodeURIComponent').decodeURIComponent();
      ctx.checkBody('decodeURIComponent').encodeURIComponent();
      ctx.checkBody('rep').replace(',', '');
      ctx.checkBody('base64').clone('base64Buffer').decodeBase64(true);
      ctx.checkBody('base64').decodeBase64();
      ctx.checkBody('debase64').encodeBase64();
      ctx.checkBody('hash').clone('md5').md5();
      ctx.checkBody('hash').clone('sha1').sha1();
      ctx.checkBody('hash').clone('num1', 1);
      ctx.checkBody('json').toJson();
      if (ctx.errors) {
        ctx.body = ctx.errors;
        return;
      }
      var body = ctx.request.body;
      if (body.default != 'default') {
        ctx.throw(500);
      }
      if (body.int_ !== 20) {
        ctx.throw(500);
      }
      if (body.octal_ !== 8) {
        ctx.throw(500);
      }
      if (body.float_ !== 1.2) {
        ctx.throw(500);
      }
      if (body.bool !== true) {
        ctx.throw(500);
      }
      if (body.falseValue !== false) {
        ctx.throw(500);
      }
      if (new Date('2014-01-01').getTime() !== body.date.getTime()) {
        ctx.throw(500);
      }

      if (body.trim != 'jim') {
        ctx.throw(500);
      }
      if (body.ltrim != 'jim ') {
        ctx.throw(500);
      }
      if (body.rtrim != ' jim') {
        ctx.throw(500);
      }
      if (body.up != 'JIM') {
        ctx.throw(500);
      }
      if (body.low != 'jim') {
        ctx.throw(500);
      }
      if (body.escape != '&lt;div&gt;') {
        ctx.throw(500);
      }
      if (body.stripLow != 'abc') {
        ctx.throw(500);
      }
      if (body.whitelist != 'll') {
        ctx.throw(500);
      }
      if (body.blacklist != 'heo') {
        ctx.throw(500);
      }
      if (encodeURI(url) != body.decodeURI) {
        ctx.throw(500);
      }
      if (decodeURI(url) != body.encodeURI) {
        ctx.throw(500);
      }
      if (encodeURIComponent(url) != body.decodeURIComponent) {
        ctx.throw(500);
      }
      if (decodeURIComponent(url) != body.encodeURIComponent) {
        ctx.throw(500);
      }
      if (body.rep != 'ab') {
        ctx.throw(500);
      }
      if (body.base64 != 'hello') {
        ctx.throw(500);
      }
      if (body.debase64 != 'aGVsbG8=') {
        ctx.throw(500);
      }
      'hello'.should.equal(body.base64Buffer.toString());
      body.md5.should.equal('5d41402abc4b2a76b9719d911017c592');
      if (body.sha1 != 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d') {
        ctx.throw(500);
      }
      if (body.num1 != 1) {
        ctx.throw(500);
      }
      if (body.json.a != 1) {
        ctx.throw(500);
      }
      ctx.body = 'ok';
    });
    request(server)
      .post('/sanitizers')
      .send({
        int_: '20',
        octal_: '10',
        float_: '1.2',
        bool: '1',
        falseValue: 'false',
        date: '2014-01-01',
        trim: ' jim ',
        ltrim: ' jim ',
        rtrim: ' jim ',
        json: '{"a":1}',
        up: 'jim',
        low: 'Jim',
        escape: '<div>',
        stripLow: 'abc\r',
        whitelist: 'hello',
        blacklist: 'hello',
        encodeURI: encodeURI(url),
        decodeURI: url,
        encodeURIComponent: encodeURIComponent(url),
        decodeURIComponent: url,
        rep: 'a,b',
        debase64: 'hello',
        base64: 'aGVsbG8=',	//hello
        hash: 'hello'		//md5 should be 5d41402abc4b2a76b9719d911017c592 , shal should be aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d

      }).expect(200)
      .expect('ok', done);
  });
});

