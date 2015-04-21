var http = require('http');
var fs = require('fs')

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
};

var options = {
    host: 'localhost',
    path: '/echo',
    port: '4730',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};


fs.readFile('/home/szmurlor/src/dydaktyka/prir/FileIndexerNodeJS/app.js', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    var post_data = JSON.stringify({
        'data' : data
    });

    var req = http.request(options, callback);
    req.write(post_data);
    req.end();

    console.log(data);
});


