'use strict';

var http = require('http');
var should = require('should');
var request = require('supertest');
var tianma = require('tianma');
var route = require('..');



function createApp() {
    var app = tianma();
    var server = http.createServer(app.run);
    app.server = server;
    return app;
}


describe('route(method/rule)', function () {

    function createServer(rule) {
        var app = createApp();

        app.use(route(rule)).then
            .use(function *(next){
                var data = this.request.pathname;
                this.response.data(data);
            })
        .end

        return app.server;
    }

    it('should allow setting method : get ', function(done) {
        request(createServer('get/path/'))
            .get('/path/')
            .expect('/path/')
            .end(done);
    });

    it('should allow setting method : post ', function(done){
        request(createServer('post/path/'))
            .post('/path/')
            .expect('/path/')
            .end(done);
    });

    it('should ignore setting method ', function(done){
        request(createServer('/path/'))
            .get('/path/')
            .expect('/path/')
            .end(done);
    });
});

describe('route(/:rule)', function(){

    function createServer(rule) {
        var app = createApp();

        app.use(route(rule)).then
            .use(function *(next){
                var data = JSON.stringify(this.request.params);
                this.response.data(data);
            })
        .end

        return app.server;
    }

    it('should match placeholder rule ', function(done) {
        request(createServer('/path/:name'))
            .get('/path/tom')
            .expect('{"name":"tom"}')
            .end(done);
    });

});



