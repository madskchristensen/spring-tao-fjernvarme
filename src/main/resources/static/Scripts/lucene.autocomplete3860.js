//$.getJSONP = function(url, data, handler) {
//	//url += "?searcher=WebsiteSearcher&callback=?";
//    url += "?callback=?";
//    return $.getJSON(url, data, handler);
//};

$.ui.autocomplete.prototype._renderItem = function (ul, item) {
    var terms = this.term.split(' ');
    var filteredTerms = [];

    // Filter terms where length < 1
    for (var i = 0; i < terms.length; i++) {
        var term  = terms[i];
        
        if ($.trim(term).length > 1) {
            filteredTerms.push(term);
        }
    }

    var regex = filteredTerms.join("|");
    var entireWord = new RegExp("(" + regex + "[^\\s]*)", "gi");
    var partialWord = new RegExp("(" + regex  + ")", "gi");
    
    var result = item.label.replace(partialWord, "<b>$1</b>");
    result = result.replace(entireWord, "<span style='color: gray'>$1</span>");
    return $("<li></li>")
       .data("item.autocomplete", item)
       .append("<a>" + result + "</a>")
       .appendTo(ul);
};

$.fn.toAutoComplete = function (options) {
    if (!options) {
        options = {};
    }

    this.bind("keydown", function (event) {
        if (event.keyCode === $.ui.keyCode.TAB &&
            $(this).data("ui-autocomplete").menu.active) {
            event.preventDefault();
        }
        
        if (event.keyCode === $.ui.keyCode.ENTER) {
            if (this.onsend) {
                this.onsend(this.element.value);
                event.preventDefault();
            }
        }
    });

    options.onsend = function(value) {
    };

    options.select = function(event, data) {
		var form = $(this).closest("form");
		form.find("#q").val(data.item.value)
		form.submit();  
    };

    options.source = dataSource;
    this.autocomplete(options);

    function dataSource(request, response) {

        $.getJSON(options.url, { q: request.term, currentNodeId: window.pageId }, handler);
        
        function handler(result) {
            if (options.onComplete) {
                return options.onComplete(result, response);
            }
            else {
                return response($.map(result, function (item) {
                    return {
                        label: item,
                        value: item
                    };
                }));
            }
        }
    }
};
