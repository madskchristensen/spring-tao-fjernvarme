// BorgerDK artikler
$("#kernetekst").addClass("borger-content accordion");

$("#kernetekst div > h2").wrap("<a href='#' class='accordion-title trigger'></a>");
$("#kernetekst div > div").css("display","none");
/*	
$('#kernetekst > div').each(function () {
	
	var headerText = $($(this).children().get(0));
	var bodyText = $($(this).children().get(1));
	
	var headline = $('<div class="accordion-item-headline">');
	var contentDiv = $('<div class="accordion-item-content"></div>');
	
	$(this).addClass("accordion-item");
	
	headline.appendTo($(this));
	
	headline.append('<div class="accordion-icon"></div>');
	
	headline.find(".accordion-icon").append(''
					+ '<svg height="25" version="1.1" width="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"> <g>'
					+ '<path class="plus" fill="none" stroke="#fff" stroke-width="5" d="m 32,4.962098 0,53.893986" transform="matrix(1,0,0,1,0,0)"></path>'
					+ '<path class="minus" fill="none" stroke="#fff" stroke-width="5" d="m 5.1127494,31.909091 53.8342436,0" transform="matrix(1,0,0,1,0,0)"></path>'
					+ '</g> </svg>');
	
	
	
	if (!Modernizr.svg) { 
		headline.find(".accordion-icon").append('<div class="ie-icon"> </div>');
	}
	
	headerText.appendTo(headline);
	
	
	contentDiv.appendTo($(this));
	bodyText.appendTo(contentDiv);
	
	
});
*/

// BorgerDK link
//$('#selvbetjeningslinks').addClass("selfservice-links primary-bg");
$('#selvbetjeningslinks').addClass("selfservice-links");
$('#selvbetjeningslinks li a').addClass("calltoactiontext");
$('#selvbetjeningslinks li a').attr("target", "_blank");
	
$('#faktaboks').addClass("selfservice-links");
$('#faktaboks li a').addClass("calltoactiontext");
$('#faktaboks li a').attr("target", "_blank");
/*
$('#selvbetjeningslinks > ul').find("a").each(function () {
	var linkContainer = $("#selvbetjeningslinks"); 
	var linkWrapper = jQuery("<p>",{"class" : "calltoactiontext primary-border"});
	linkWrapper.appendTo(linkContainer);
	$(this).attr("target", "_blank");
	$(this).appendTo(linkWrapper);
});*/


// BorgerDK sidebar
$('#borgedkSidebar').children("div").each(function(){
	$(this).addClass("hotspot-item");
	var childList = $(this).children();
	
	var hotspotContent = jQuery("<div>",{
		"class" : "hotspot-content"
	});
	hotspotContent.appendTo($(this));
	
	var hotspotText = jQuery("<div>",{
		"class" : "hotspot-text"
	});
	hotspotText.appendTo(hotspotContent);
	
	var linkIcon= '<span class="colored-circle medium primary primary-bg">'
		+'<i class="icon-arrow-right"></i>'
			+'</span>';
	
	var addLinkIcon = function(link){
		$(linkIcon).prependTo($(link));
	};
	
	var cleanSpan = function(span){
		var text = $(span).html();
		$(span).html(text.replace(/(&nbsp;)*/g,''));
	};
	
	for(var i = 1; i < childList.length; i++){
		var childItem = $(childList[i]);
		var containsLinks = false;
		
		childItem.find("span").each(function(index, spanElement) {
			cleanSpan(spanElement);
		});
		
		childItem.find("a").each(function(index, linkElement){
			addLinkIcon(linkElement);
			containsLinks = true;
		});
		
		if(childItem.is("span")){
			cleanSpan(childItem);
		}
		if(childItem.is("a")){
			addLinkIcon(childItem);
		}
		if(childItem.is("ul") && !containsLinks){
			childItem.addClass("no-links-ul");
		}
		
		
		childItem.appendTo(hotspotText);
	}
});

