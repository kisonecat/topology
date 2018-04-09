var moment = require('moment')
  , pug = require('pug');

var latexToUnicode = require('latex-to-unicode');

var yaml = require('js-yaml');
var _ = require('underscore');
var fs = require('fs');
var file = require('file');
var chrono = require('chrono-node');

var tex = function(s) {
    var pieces = s.split( '$' );
    return _.map( pieces, function(p, i) {
	if (i % 2 == 1)
	    return '<em>' + p + '</em>';
	else
	    return p;
    }).join('');
    
};

var clean = function(s) {
    return s
        .replace( /\\to/g, '&rarr;' )    
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

    var talk = _.filter( talks, function(talk){ return talk.date > new Date(); } )[0];

    var template = pug.compileFile(__dirname + '/layouts/email.pug');
    var html = template({ talk: talk, tex: tex, moment: moment, clean: clean, buildings: buildings });

    var heading =
	['Dear all,',
	 'The Topology Seminar meets ' + moment(talk.date).format('MMMM Do YYYY') + ' at ' + moment(talk.date).format('h:mma') + ' in ' + talk.location + '.',
	 'Everybody is invited.',
	 '--'];
    var stanza =
	['Speaker: ' + clean(talk.speaker) + ' (' + talk.institution + ')',
	 'Title: ' + clean(talk.title),
	 'Time: ' + moment(talk.date).format('dddd, MMMM DD, YYYY') + ' at ' + moment(talk.date).format('h:mma'),
	 'Place: ' + talk.location];
    var footer = ['Upcoming talks are available at https://research.math.osu.edu/topology/','~jim']

    console.log( "Subject: " + clean(talk.speaker) + ': ' + talk.title );

    console.log( "To: Topologists <topology@math.ohio-state.edu>" );
    console.log( "Cc: grads@math.ohio-state.edu, faculty@math.ohio-state.edu" );

    console.log();
    
    console.log( heading.join("\n\n") + "\n\n" + stanza.join("\n") + "\n\nAbstract: " + talk.abstract + "\n\n" + footer.join("\n\n") );
    
});


