var http = require('http');
var fs = require('fs');
var async = require('async');

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    // console.log(str);
  });
};

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


async.series([
    function (callback) {
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

            var req = http.request(options_push, callback);
            req.write(post_data);
            req.end();

            console.log(data);
            callback();
        });
    },
    function (callback) {
        console.log('Pytam search...');
        options_search.path = "/search/jesienny";
        var req = http.request(options_search, function (response) {
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
            });
        });
        req.end();
        // callback();
    }]);




