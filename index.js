var express = require('express')
  , logger = require('morgan')
  , app = express()
  , moment = require('moment')
  , pug = require('pug');

var yaml = require('js-yaml');
var _ = require('underscore');
var fs = require('fs');
var file = require('file');
var chrono = require('chrono-node');

var clean = function(s) {
    return s
	.replace( '---', '&mdash;' )
	.replace( '--', '&ndash;' )    
	.replace( ' -- ', '&mdash;' )
	.replace( "''", '&rdquo;' )
	.replace( "``", '&ldquo;' )
	.replace( "\\'e", '&eacute;' )
	.replace( "\\`e", '&egrave;' )
	.replace( "\\'a", '&aacute;' )
	.replace( "\\'o", '&oacute;' )
	.replace( /\\"u/g, '&uuml;' )
	.replace( /\\"o/g, '&ouml;' )    
	.replace( "'", '&rsquo;' )
	.replace( "`", '&lsquo;' )
	.replace( /\\textit{([^}]+)}/, '<em>$1</em>' )
	.replace( /\\textit{([^}]+\$[^$]+\$[^}]+)}/, '<em>$1</em>' )
    ;
};

////////////////////////////////////////////////////////////////
// Load buildings
var buildings = {};
require('fs').readFileSync('buildings.txt').toString().split("\n").forEach( function(line) {
    line = line.split('; ');
    if (line.length >= 4) {
	buildings[line[3]] = { name: line[1], href: "http://www.osu.edu/map/building.php?building=" + line[0]};
    }
});


////////////////////////////////////////////////////////////////
// Load files
var talks = [];

file.walk( './talks', function(err, path, dirs, files) {
    files.forEach( function(filename) {
	var doc = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));

	if (doc) {
	    if (doc.date)
		doc.date = chrono.parseDate(doc.date);

	    if (doc['speaker-url'])
		doc.speaker_url = doc['speaker-url'];

	    if (doc['institution-url'])
		doc.institution_url = doc['institution-url'];	    
	    
	    doc.filename = filename;
	    
	    talks.unshift( doc );
	}
    });

    talks = _.sortBy( talks, function(talk){ return talk.date } );
});

var root = '/topology';

app.use(logger('dev'));
app.use(root + "/javascripts", express.static(__dirname + '/public/javascripts'));
app.use(root + "/javascripts/jquery.inview.js", express.static(__dirname + '/node_modules/jquery-inview/jquery.inview.min.js'));
app.use(root + "/javascripts/jquery.scrollto.js", express.static(__dirname + '/node_modules/jquery.scrollto/jquery.scrollTo.min.js'));
app.use(root + "/people", express.static(__dirname + '/people'));

var expressLess = require('express-less');

app.use(root + "/stylesheets", expressLess(__dirname + '/public/stylesheets'));

app.get(root + "/index.html", function (req, res, next) {
    try {
	var template = pug.compileFile(__dirname + '/layouts/index.pug');
	var html = template({ title: 'Home', talks: talks, moment: moment, clean: clean, buildings: buildings, root: root });
	res.send(html);
    } catch (e) {
	next(e);
    }
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
});
