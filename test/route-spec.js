'use strict';

var http = require('http');
var route = require('..');
var request = require('supertest');
var tianma = require('tianma');

function createApp() {
    var app = tianma();
    var server = http.createServer(app.run);

    app.server = server;

    return app;
}

describe('route(method)', function () {
    function createServer() {
        var app = createApp();

        app
            .use(route('get')).then
                .use(function *(next) {
                    this.response.data('get');
                })
                .end
            .use(route('POST')).then
                .use(function *(next) {
                    this.response.data('post');
                })
                .end
            .use(function *(next) {
                this.response.status(403);
            });

        return app.server;
    }

    it('should allow get method', function (done) {
        request(createServer())
            .get('/')
            .expect('get')
            .end(done);
    });

    it('should allow post method', function (done) {
        request(createServer())
            .post('/')
            .expect('post')
            .end(done);
    });

    it('should reject others', function (done) {
        request(createServer())
            .put('/')
            .expect(403)
            .end(done);
    });
});

describe('route(pathname)', function () {
    function createServer() {
        var app = createApp();

        app
            .use(route('/foo')).then
                .use(function *(next) {
                    this.response.data('foo');
                })
                .end
            .use(route('/bar/')).then
                .use(function *(next) {
                    this.response.data('bar');
                })
                .end
            .use(route('/baz/:id')).then
                .use(function *(next) {
                    this.response.data(this.request.params.id);
                })
                .end
            .use(function *(next) {
                this.response.status(403);
            });

        return app.server;
    }

    it('should allow /foo', function(done) {
        request(createServer())
            .get('/foo')
            .expect('foo')
            .end(done);
    });

    it('should allow /foo/', function(done) {
        request(createServer())
            .get('/foo/')
            .expect('foo')
            .end(done);
    });

    it('should allow /bar', function(done) {
        request(createServer())
            .get('/bar')
            .expect('bar')
            .end(done);
    });

    it('should allow /bar/', function(done) {
        request(createServer())
            .get('/bar/')
            .expect('bar')
            .end(done);
    });

    it('should allow /baz/hello', function(done) {
        request(createServer())
            .get('/baz/hello')
            .expect('hello')
            .end(done);
    });

    it('should reject others', function(done) {
        request(createServer())
            .get('/hello/world')
            .expect(403)
            .end(done);
    });
});

describe('route(method pathname)', function () {
    function createServer() {
        var app = createApp();

        app
            .use(route('get /article/:id')).then
                .use(function *(next) {
                    this.response.data(this.request.params.id);
                })
                .end
            .use(route('post /article/:data')).then
                .use(function *(next) {
                    this.response.data(this.request.params.data);
                })
                .end
            .use(function *(next) {
                this.response.status(403);
            });

        return app.server;
    }

    it('should allow get /article/12', function(done) {
        request(createServer())
            .get('/article/12')
            .expect('12')
            .end(done);
    });

    it('should allow post /article/hello', function(done) {
        request(createServer())
            .post('/article/hello')
            .expect('hello')
            .end(done);
    });

    it('should reject others', function(done) {
        request(createServer())
            .put('/article/hello')
            .expect(403)
            .end(done);
    });
});
