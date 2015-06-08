/**
 * Created by szmurlor on 08.06.15.
 */

var imax = 2;
var imaxe = 10;
var imaxne = 10;
var imaxkn = 10000;


var http = require('http');
var fs = require('fs');

var options_push = {
    host: 'localhost',
    path: '/push',
    port: '4730',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

var options_search = {
    host: 'localhost',
    path: '/search',
    port: '4730',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};


exports.testKrotki = function(test){
    fs.readFile('tekst-krotki.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        var post_data = JSON.stringify({
            // filename: "reymont-chlopi-zima.txt",
            filename: "tekst-krotki.txt",
            data: data,
            folder: "/home/data/example"
        });

        var str = "";
        var req = http.request(options_push, function(res) {
            res.on('data', function(chunk) {
                str += chunk;
            });
            res.on('end', function() {
               //console.log(str);
               test.equal(str, '<p>OK</p>', "Niewłaściwa odpowiedź.");
               test.done();
            });
        });
        req.write(post_data);
        req.end();
    });
};

exports.testDlugi = function(test){
    var i = 0;

    function doTest() {
        fs.readFile('reymont-chlopi-zima.txt', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            var post_data = JSON.stringify({
                // filename: "reymont-chlopi-zima.txt",
                filename: "reymont-chlopi-zima-"+ i +".txt",
                data: data,
                folder: "/home/data/example_" + i
            });

            var str = "";
            var req = http.request(options_push, function (res) {
                res.on('data', function (chunk) {
                    str += chunk;
                });
                res.on('end', function () {
                    //console.log(str);
                    test.equal(str, '<p>OK</p>', "Niewłaściwa odpowiedź.");

                    if (i++ < imax)
                        doTest();
                    else
                        test.done();
                });
            });
            req.write(post_data);
            req.end();
        });
    };
    doTest();
};

exports.testSearchNoExists = function(test){
    var i = 0;

    function doSearch() {
        options_search.path = "/search/jesiennykol";
        var req = http.request(options_search, function (response) {
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
                if (i++ < imaxne)
                    doSearch();
                else
                    test.done();
            });
        });
        req.end();
    }

    doSearch();
};

exports.testSearchExists = function(test){
    var i = 0;

    function doSearch() {
        options_search.path = "/search/0011223344";
        var req = http.request(options_search, function (response) {
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
                if (i++ < imaxe)
                    doSearch();
                else
                    test.done();
            });
        });
        req.end();
    }

    doSearch();
};

exports.testKrotkiN = function(test){
    var i = 0;

    function doKrotoki() {
        fs.readFile('tekst-krotki.txt', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            var post_data = JSON.stringify({
                // filename: "reymont-chlopi-zima.txt",
                filename: "tekst-krotki" + i +".txt",
                data: data,
                folder: "/home/"+i+"/example"
            });

            var str = "";
            var req = http.request(options_push, function(res) {
                res.on('data', function(chunk) {
                    str += chunk;
                });
                res.on('end', function() {
                    //console.log(str);
                    test.equal(str, '<p>OK</p>', "Niewłaściwa odpowiedź.");

                    if (i++ < imaxkn)
                        doKrotoki();
                    else
                        test.done();
                });
            });
            req.write(post_data);
            req.end();
        });
    }
    doKrotoki();
};
