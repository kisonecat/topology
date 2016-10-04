$(document).ready( function(){
	      
    var attrKeyString = 'evaluation';
    var attrValueString = 'lazy';
    var count = 0;
    $(document).find('div['+attrKeyString+']').each(function(index, element) {
        if ($(element).attr(attrKeyString) == attrValueString){
	    var reStartMathJax = new RegExp('\\\\\\[', "g");        
	    var reEndMathJax = new RegExp('\\\\\\]', "g");        
	    var newHtml = $(element).html().replace(reStartMathJax, '\\MJ[');
            newHtml = newHtml.replace(reEndMathJax, '\MJ]');

	    var reStartMathJax = new RegExp('\\\\\\(', "g");   
	    var reEndMathJax = new RegExp('\\\\\\)', "g");
	    var newHtml = $(element).html().replace(reStartMathJax, '\\MJ(');
            newHtml = newHtml.replace(reEndMathJax, '\\MJ)');

	    var reStartMathJax = new RegExp('\\$', "g");        
	    var newHtml = $(element).html().replace(reStartMathJax, '%MJ%');
	    
	    //if (count % 10 == 0){alert('new newHtml == '+newHtml);}
	    //count += 1;
            $(element).html(newHtml);
        }
    });

});

// Find the div's marked with the attribute key 'evaluation' and value 'lazy'. Associate those div's with with Remy Sharp's 'inview' plugin. This function is only executed once which is when the div is in the viewport.
$(function () {
    var attrKeyString = 'evaluation';
    var attrValueString = 'lazy';
    var count = 0;
    $(document).find('div['+attrKeyString+']').each(function(index, element) {
        if ($(element).attr(attrKeyString) == attrValueString){
            
            $(element).one('inview', function (event, visible) {
		if (visible) {
		    var reStartMathJax = new RegExp('\\\\MJ\\[', "g");        
		    var reEndMathJax = new RegExp('\\\\MJ\\]', "g");
		    
		    var elementHtml = $(element).html();
		    var containsStart = reStartMathJax.test(elementHtml);
		    var containsEnd = reEndMathJax.test(elementHtml);

		    if(containsStart && containsEnd){
			var newHtml = $(element).html().replace(reStartMathJax, '\\[');
			newHtml = newHtml.replace(reEndMathJax, '\\]');
			//if (count % 10 == 0){alert('new newHtml == '+newHtml);}
			//count += 1;
			$(element).html(newHtml);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, $(element).get(0)]);
		    }

		    var reStartMathJax = new RegExp('\\\\MJ\\(', "g");        
		    var reEndMathJax = new RegExp('\\\\MJ\\)', "g");
		    
		    var elementHtml = $(element).html();
		    var containsStart = reStartMathJax.test(elementHtml);
		    var containsEnd = reEndMathJax.test(elementHtml);

		    if(containsStart && containsEnd){
			var newHtml = $(element).html().replace(reStartMathJax, '\\(');
			newHtml = newHtml.replace(reEndMathJax, '\\)');
			//if (count % 10 == 0){alert('new newHtml == '+newHtml);}
			//count += 1;
			$(element).html(newHtml);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, $(element).get(0)]);
		    }

		    var reStartMathJax = new RegExp('%MJ%', "g");        
		    
		    var elementHtml = $(element).html();
		    var containsStart = reStartMathJax.test(elementHtml);

		    if(containsStart){
			var newHtml = $(element).html().replace(reStartMathJax, '$');
			$(element).html(newHtml);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, $(element).get(0)]);
		    }		    

		}
            });
        }
    });
});
	  
		    
