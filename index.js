var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var querystring = require('querystring')

var files = [
	{
		id: "autogeneratedid",
		filename: "pusty dokument.txt",
		data: "",
		folder: "/home/data/example"
	}
];
var id = 1;


app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));

/**
 * OBOWIĄZKOWE ZAPYTANIA
 */

app.get('/search/:word', function(req, res) {
	var ans = [];
	var word = querystring.unescape(req.params.word);
	var i, r;
	console.log('Szukam: ' + word + '.');


	for (i=0; i <  files.length; i++) {
		r = find(files[i], word);
		if (r)
			ans.push(r);
	}

    res.json(ans);
});

function find(f, word) {
	var res =  {
					id: f.id,
					filename: f.name,
					folder: f.folder,
					positions: []
				};
	var s = f.data;
	var m = word.length;
	var Sx = 0;
	var Sy = 0;
	var line = 0;

	for (var i=0; i < m; i++) {
		Sx = Sx + word.charCodeAt(i);
		Sy = Sy + s.charCodeAt(i);

		if (s.charCodeAt(i) == 10)
			line++;
	}
	for (i=0; i < s.length-m+1; i++) {
		if (Sx == Sy) {
			if (s.substr(i, m) == word) {
				res.positions.push({
					pos: i,
					line: line
				});
			}
		}
		Sy = Sy - s.charCodeAt(i) + s.charCodeAt(i+m);
		if (s.charCodeAt(i+m) == 10)
			line++;
	}

	return res;

}


app.get('/files', function(req, res) {
	var f = [];

	for (var i=0; i < files.length; i++ ) {
		var tmp = {
			id: files[i].id,
			name: files[i].filename
		};
		f.push(tmp);
	}

	res.json(f);
});


app.post('/push', function(req, res) {
	// console.log(req.body);
	id++;
	var file = {
		id: "" + id,
		filename: req.body.filename,
		data: req.body.data,
		folder: "/home/data/example"
	};
	files.push(file);
	var s = '<p>OK</p>';
	res.send(s);
});


/**
 * OPCJONALNE ZAPYTANIA
 */
app.get('/file/:id', function(req, res) {
	var id = req.params.id;

	var f = null;
	for (var i=0; i < files.length; i++ ) {
		if (files[i].id == id) {
			f = files[i];
			break;
		}
	}
	if (f == null) {
		res.type("text/plain");
		res.send("Nie mogę odnaleźć pliku o id: " + id);
	} else {
		res.json(f);
	}
});

app.listen(process.env.PORT || 4730);
