$(function() {

    var epsilon = 10;
    
    $(document).keydown(function(e) {
	switch( e.keyCode ) {
	case 40:
	    var cutoff = $(window).scrollTop();
	    $('.scrollto').each(function() {
		if ($(this).offset().top > cutoff + epsilon) {
		    $.scrollTo( this, 100 );
		    return false; // stops the iteration after the first one on screen
		}
	    });
	    return false;
	    
	case 38:
	    var cutoff = $(window).scrollTop();
	    var top_node;
	    $('.scrollto').each(function() {
		if ($(this).offset().top < cutoff - epsilon) {
		    top_node = this;
		}
	    });
	    $.scrollTo( top_node, 100 );
	    return false;
	}
    });
    
});
