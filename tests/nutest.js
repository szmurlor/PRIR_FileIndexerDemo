/**
 * Created by szmurlor on 08.06.15.
 */

var imax = 2;
var imaxe = 10;
var imaxne = 10;
var imaxkn = 10;


var http = require('http');
var fs = require('fs');

var options_push = {
    //host: 'localhost',
    host: '10.146.51.117',
    path: '/push',
    // port: '4730',
    port: '8000',
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
};

var options_search = {
    //host: 'localhost',
    host: '10.146.51.117',
    path: '/search',
    //port: '4730',
    port: '8000',
    method: 'GET',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
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
	options_push.headers['Content-length'] = post_data.length;
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
	    options_push.headers['Content-length'] = post_data.length;
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
    doSearch(test, 0, "jesiennykol", true, false);
};


exports.testSearchExists = function(test){
    doSearch(test, 0, "0011223344", false, true, function (test, response) {
        // test.ok(response.indexOf('{"pos":7997,"line":56}') >= 0, "Nie odnaleziono ciągu znaków 0011223344!");
        test.ok(response.indexOf('7997') >= 0, "Nie odnaleziono ciągu znaków 0011223344!");
    });
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
	    options_push.headers['Content-length'] = post_data.length;
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

exports.testSearchNoExists = function(test){
    doSearch(test, 0, "jesiennykoloudsfidasfdsuifsfyasduiyfoisuayfouisayfuyfoudysfouisdyfouiaydhfuidsahfiusdhafui9798876udyfiuaysfiusd12222-2-2--22-sdoufiysdaoiufyaos", true, false);
};




function doSearch(test, i, what, increment,print, callback) {
    if (increment)
        options_search.path = "/search/" + what + i % 200;
    else
        options_search.path = "/search/" + what;
    var req = http.request(options_search, function (response) {
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            if (print)
                console.log(str);
            if (callback)
                callback(test, str);


            if (i < imaxe)
                doSearch(test, i+1, what, increment, print, callback);
            else
                test.done();
        });
    });
    req.end();
}
