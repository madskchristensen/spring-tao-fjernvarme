//-----------------------------------------------------
//Open Public 
//Navigation Animation 
//By Mediaworkers 2013
//-----------------------------------------------------

var selectorId = "mega-menu"
var selector = $("#" + selectorId);
var animationTime = 300; //300
var slideEffectDevider = 0.6; //0.6
var timeoutBeforeCallback = 200; //200 
var animationEffect = "easeOutQuad";
var isAnimating = false;
var useAnimation = true;
var megaMenuHeight = $(selector).height();
var isClicked = false;
var ulHeight = 54; //Change this, if you change the size of links in the navigation.

function isTouchDevice() {
	return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch || navigator.msMaxTouchPoints > 0);
}

function animationClosingTime(openUlHeight)
{
	return 200 + 0.2 * openUlHeight;
}


//Ready function
$(function () {

	//Make sure section links go directly to the link
	$(selector).find("li.section").on('click', function () {

		var link = $(this).children("a").attr("href");
		window.location = link;

		return false;
	});


	// Default settings
	var settings = {
		activeContainerClass: "selected",
		addingActiveContainerClass: "selected-entering",
		removeingActiveContainerClass: "selected-exiting",
		transformingAncestorContainerClass: "pre-previous",
		activeSubContainerClass: "expanded",
		activeAncestorSubContainerClass: "previous",
		loadingItemsContainerClass: "loading",
		onClose: closeNavigation,
		onActivate: navigationAnimation,
		onItemsLoad: null,
		onItemsLoaded: null
	};


	$(selector).opMenu(settings);


	$(window).resize(function () {
		var currentcontainer = $(selector).find(".open:last");
		$(currentcontainer).css("height", getContainerHeight(currentcontainer) + "px");
	});
	


	//OPEN MENU ON CURRENT PAGE
	$("#open-current-page-in-menu").click(function (e) {

		e.preventDefault();
		
		if (isClicked) 
			return;

		isClicked = true;

		setTimeout(function () {
			isClicked = false;
		}, 1500);

		openCurrentPage(settings);

	});

});






//Close the navigation
function closeNavigation(callback) {
	
	if (isAnimating)
		return;
		
	$(selector).find("li.clicked").removeClass("clicked");

	if ($(selector).find("ul.open").length > 0) {

		var lastOpenUl = $(selector).find("ul.open").last();
		var openUlHeight = lastOpenUl.height();

		lastOpenUl.slideUp(animationClosingTime(openUlHeight) / 2, "linear", function () {

			$(this).removeClass("open");
			closeNavigation(callback);

		});
	}
	else {
		$(selector).find("ul").removeAttr("style");
		$(selector).find("ul").find("li").removeAttr("style");
		callback();

	}
}





//Open navigation on current page
function openCurrentPage(settings) {

	

	//Close navigation before opening			
	closeNavigation(function () {

		$(selector).find("." + settings.activeContainerClass
						 + ", ." + settings.transformingAncestorContainerClass
						 + ", ." + settings.activeSubContainerClass
						 + ", ." + settings.activeAncestorSubContainerClass
						 + ", ." + settings.loadingItemsContainerClass)
			.andSelf()
			.removeClass(settings.activeContainerClass)
			.removeClass(settings.transformingAncestorContainerClass)
			.removeClass(settings.activeSubContainerClass)
			.removeClass(settings.activeAncestorSubContainerClass)
			.removeClass(settings.loadingItemsContainerClass);


		placeAndScaleNavigation();

		var currentPage = $("li.current").last();
		var currentPageParent = $(currentPage).parent("ul");
		var currentPageParentParent = $(currentPageParent).parent("li").parent("ul");
		var link = currentPageParent.parent("li").find(">a");
		var remainingUls = $(currentPageParentParent).parent("li").parents("ul").not(selector);
		var remainingUlCount = $(remainingUls).length;
		
		//Change "selected" classes to change state of menu if open.
		$("li.selected").removeClass("selected");
		$("li.current").addClass("selected");
		$(currentPage).removeClass("selected");
		$(remainingUls).addClass("duplicate");


		//Adding class separately to prevent animation on the top level
		$(selector).addClass("open expanded pre-previous previous");
		$(remainingUls).addClass("open expanded pre-previous previous").css({ "display": "block", "height": "0px", "overflow": "hidden" });


		//Run recursive function
		openEachUl();

		function openEachUl() {

			//Open the top level UL's in right order
			if ($("ul.duplicate").length > 0) {

				$("ul.duplicate").first().css({ "height": "0px", "overflow": "" }).animate({

					"height": ulHeight + "px"

				}, animationTime / 3, "linear", function () {

					$("ul.duplicate").first().removeClass("duplicate")

					//Run function again
					openEachUl();
				});
			}


				// ...Then, //Slide down current page parent UL, after the first animation is done
			else {

    			if ($(currentPageParentParent).attr("id") !== selectorId) {
                    $(currentPageParentParent).addClass("open expanded").css({ "display": "block", "height": "0px" }).animate({
                        "height": ulHeight + "px"

                    }, animationTime / 3, "linear", function () {

                        //Slide down UL where current page is present, after the second animation is done
                        $(currentPageParent).addClass("open").css({}).slideDown(animationTime, animationEffect);
                        setTimeout(function () {
                            fixDobbleLineLinks(link);
                        }, 150);
                    });
                } else {
                    //Slide down UL where current page is present, after the second animation is done
                    $(currentPageParent).addClass("open").css({}).slideDown(animationTime, animationEffect);
                    setTimeout(function () {
                        fixDobbleLineLinks(link);
                    }, 150);
                }
			}
		}//End openEachUl function

	}); //End closeNavigation function

}





//ANIMATION FOR THE DROPDOWN MENU
function navigationAnimation(link, callback, settings) {

	if (!useAnimation) {
		callback();
		return;
	}

	var ulWidth = $(selector).parent().width();

	//IF THERE IS NOTHING ANIMATING
	if (!isAnimating) {

		isAnimating = true;

		placeAndScaleNavigation();

		clickedStateOnRootItems(link);
		
		
		//CLOSE NAVIGATION ON CLICK IF LINK IS ROOT AND PARENT
		closeNavOnRootLinkIfParent(link, settings);
		

		//IF THE CLICKED LINK IS A ROOT LINK - AND THE MENU IS NOT OPEN YET, DO THIS........
		if (($(selector).children("li").children("a").is($(link)) && $(link).next("ul:not(.open)").length > 0) || $(link).parent("li").parent("ul#mega-menu").length > 0) {

			closeCurrentNavAndOpenClicked(link, callback);
			
		}

		else {
			
			//Going back in the navigation tree
			//IF THE CLICKED LINK IS A PREVIOUS LINK - CLOSE CHILDRENS AND OPEN THE UL, WHERE THE LINK IS.
			if ($(link).parent("li").parent("ul.expanded").not("#mega-menu").length > 0) {

				$(link).parent("li").parent("ul").addClass("dontClose");

				
				function recursiveSlide() {

					//SLIDE CHILDREN UP
					if ($(link).parent("li").find("ul.open:not(.dontClose)").length > 0) {

						var lastOpenUl = $(link).parent("li").find("ul.open").last();
						var openUlHeight = lastOpenUl.height();

						lastOpenUl.slideUp(animationClosingTime(openUlHeight), "linear", function () {

							$(this).removeClass("open");

							recursiveSlide();
						});

					}

					//SLIDE NEW UL DOWN
					else {

						//setTimeout to make animation more fluid..
						setTimeout(function () {

							$(link).css("overflow", "hidden");

							//FADE-IN LI's
							$(link).parent("li").parent("ul").find("> li").removeClass("selected").fadeIn(animationTime, animationEffect);

					
							//ANIMATE UL HEIGHT SLIDE DOWN, WHEN GOING BACK IN THE MENU TREE	
							$(link).parent("li").parent("ul").removeClass("expanded").css({ "overflow": "hidden", "height" : ulHeight + "px" }).animate({

								'height': getContainerHeight($(link).parent("li").parent("ul")) + "px"

							}, animationTime, animationEffect, function () {

								$("ul.dontClose").removeClass("dontClose");
								$(selector).find("ul").css({ "overflow": "visible" });

								//Remove static height, to be sure the ul is fully expanded.
								$(link).parent("li").parent("ul").css("height", "");

								//Will scroll to the clicked link, if the screen is smaller than 768px
								scrollToClickedLink($(this));

								isAnimating = false;
								callback();

							});

						}, timeoutBeforeCallback);
					}

				}//recursiveSlide END

				recursiveSlide();
			}


			//DEFAULT ANIMATION ------------------------------------------------------------------------- //
			//Going forward in the navigation tree
			else {

				//If the clicked link is NOT a section page, animate..
				if ($(link).parent("li:not(.section)").length > 0) {
					
					var liTop = $(link).parents("ul").not(selector).first().find("li.selected").offset().top - $(link).parents("ul").not(selector).first().offset().top;
					var liLeft = $(link).parents("ul").not(selector).first().find("li.selected").offset().left - $(link).parents("ul").not(selector).first().offset().left;
					var clickedUlHeight = $(link).parent("li").parent("ul").height();

					$(link).parents("ul").not(selector).first().find("li.selected").css({ "position": "absolute", "top": liTop, "left": liLeft, "z-index": 1 }).animate({

						top: 0

					}, animationTime, animationEffect);


					$(link).parents("ul").not(selector).first().css("height", clickedUlHeight).animate({

						'height': ulHeight

					}, animationTime, animationEffect, function () {

						
						//WHEN UL HAS CHANGED SIZE, DO THIS...
						$(this).find("li.selected").animate({

							left: 0

						}, animationTime, animationEffect, function () {

							//Remove absolute position, to make navigation see how "heigh" the link is
							$(link).parents("ul").not(selector).first().find("li.selected").css({ "position": ""});

							//Set height to auto, to push the navigation to the same height as the visual navigation
							$(link).parents("ul").not(selector).first().css("height", "auto");

							//AFTER LI HAS SLIDED LEFT, DO THIS...
							setTimeout(function () {
								fixDobbleLineLinks(link);
							}, 150);

							$(selector).find("ul").css("width", ulWidth);


							//SHOW UL, THEN ANIMATE
							$(link).next("ul").show().css("height", "0").addClass("open").animate({

								'height': getContainerHeight($(link).next("ul")) + "px"

							}, animationTime / 2, animationEffect, function () {

								$(selector).find("li").css({ "position": "", "top": "", "left": "", "display": "", "opacity": "" });

								//Remove static height, to be sure the ul is fully expanded.
								$(link).next("ul").css("height", "")

								scrollToClickedLink($(this));

							});


							//RESUME ADDING CLASSES TO THE MENU WITH "functionality.js" 
							callback();

							//ANIMATION IS DONE
							isAnimating = false;


						}, animationTime, animationEffect);

					}).find("> li:not(.selected)").fadeOut(animationTime);

				}
				
			}//DEFAULT ANIMATION END

		}//Else END

	}//isAnimating END

}



//CLOSE NAVIGATION ON CLICK IF LINK IS ROOT AND PARENT
function closeNavOnRootLinkIfParent(link, settings) {

	var closeSettings = {
		activeContainerClass: "selected",
		addingActiveContainerClass: "selected-entering",
		removeingActiveContainerClass: "selected-exiting",
		transformingAncestorContainerClass: "pre-previous",
		activeSubContainerClass: "expanded",
		activeAncestorSubContainerClass: "previous",
		loadingItemsContainerClass: "loading",
		onClose: closeNavigation,
		onActivate: navigationAnimation,
		onItemsLoad: null,
		onItemsLoaded: null
	};
	
	$(selector).find("> li > a").on('click', function (e) {

		if ($(e.target).parent("li").hasClass("clicked") && $(e.target).next("ul.open")) {

			
			$(selector).removeClass("active");
			
			closeNavigation(function () {

				$(selector).find("." + closeSettings.activeContainerClass
						 + ", ." + closeSettings.transformingAncestorContainerClass
						 + ", ." + closeSettings.activeSubContainerClass
						 + ", ." + closeSettings.activeAncestorSubContainerClass
						 + ", ." + closeSettings.loadingItemsContainerClass)
					.andSelf()
					.removeClass("active")
					.removeClass(closeSettings.activeContainerClass)
					.removeClass(closeSettings.transformingAncestorContainerClass)
					.removeClass(closeSettings.activeSubContainerClass)
					.removeClass(closeSettings.activeAncestorSubContainerClass)
					.removeClass(closeSettings.loadingItemsContainerClass);

				
			});
			

			return false;
		}
	});
	

}



//Close current nav, and open the one that is clicked
function closeCurrentNavAndOpenClicked(link, callback) {

	if ($(selector).find("ul.open").length > 0) {

		var lastOpenUl = $(selector).find("ul.open").last();
		var openUlHeight = lastOpenUl.height();
		
		//Not using animationClosingTime(), to make the scroll up more fluid
		lastOpenUl.slideUp(openUlHeight, "linear", function () {

			$(this).removeClass("open");

			closeCurrentNavAndOpenClicked(link, callback);
		});
	}//If END

	else {

		callback();

		$(selector).find("ul").removeAttr("style");

		placeAndScaleNavigation();

		$(link).next("ul").css({ "display": "block", "height": "0px", "overflow": "hidden" });

		fixDobbleLineLinks(link);

		setTimeout(function () {

			//ANIMATE UL HEIGHT SLIDE DOWN, WHEN GOING BACK IN THE MENU TREE	

			$(link).next("ul").addClass("open").animate({

				'height': getContainerHeight($(link).next("ul")) + "px"

			}, animationTime, animationEffect, function () {

				$(selector).find("ul").css({ "overflow": "visible" });

				//Remove static height, to be sure the ul is fully expanded.
				$(link).next("ul").css("height", "");

				isAnimating = false;
				callback();


				//Will scroll to the clicked link, if the screen is smaller than 768px
				scrollToClickedLink($(link));

			});

		}, timeoutBeforeCallback);

	}//Else END

}




//Scroll to clicked link, if screen is smaller than 768px wide.
function scrollToClickedLink(clickedItem) {


	if ($(window).width() <= 768 || isTouchDevice == true) {
		//Windows phone fix. The device bugs if the animation time is higher than 100????
		if (navigator.msMaxTouchPoints > 0) {
			animationTime = 100;
		}

		var clickedLinkTop = $(clickedItem).offset().top;
		
		$('html, body').animate({
			scrollTop: clickedLinkTop - ulHeight
		}, animationTime);
	}
}





//Get height of any "container" as a parameter
function getContainerHeight(container) {
	var minHeight = 50;
	var smartLinksHeight = $(container).find(".smart-links, .last").height();

	var liOffset = $(container).children("li:not(.smart-links)").last().offset();
	var liOffsetTop = 0;

	if (liOffset) {
		liOffsetTop = liOffset.top;
	}

	var ulOffset = $(container).offset();
	var ulOffsetTop = 0;

	if (ulOffset) {
		ulOffsetTop = ulOffset.top;
	}

	var liHeight = $(container).children("li:not(.smart-links)").last().height();

	var ulFullHeight = (liOffsetTop - ulOffsetTop) + liHeight;

	if (ulFullHeight < smartLinksHeight)
		ulFullHeight = smartLinksHeight;

	if (ulFullHeight < minHeight)
		ulFullHeight = minHeight;

	return ulFullHeight;
}





//PLACE AND SCALE UL DROPDOWN MENU
function placeAndScaleNavigation() {
			
	megaMenuHeight = $(selector).height();
														  //+10 is a BILLUND SPECIFIC FIX " + 10 to megaMenuHeight " Because of the 10px heigh border on the navigation. --------------------- BILLUND SPECIFIC //
	$(selector).find("> li > ul").css("top", megaMenuHeight + 6 + "px");

	$(window).resize(function () {
		ulWidth = $(selector).parent().width();
		megaMenuHeight = $(selector).height();
																//+10 is a BILLUND SPECIFIC FIX " + 10 to megaMenuHeight " Because of the 10px heigh border on the navigation. --------------------- BILLUND SPECIFIC //
		$(selector).find("> li > ul").css("top", megaMenuHeight + 6 + "px");
		$(selector).find("ul").css("width", ulWidth);
	});
}




//Adding "clicked" class to root links, to show wich one is active
function clickedStateOnRootItems(link) {

	if ($(selector).children("li").children("a").is($(link))) {
		$(selector).find("li.clicked").removeClass("clicked");
		$(link).parent("li").addClass("clicked");
	}
}





//FIX DOBBLE LINE LINKS - Adding margin-bottom on links that is "one line".
function fixDobbleLineLinks(link) {
    var firstLi = $(link).next("ul").find("li:first");
    var liWidth = firstLi.width();
    var ulWidth = firstLi.parent("ul").width();

    var liPerRow = Math.round( ulWidth/liWidth);

	var liTable = new Array();
	var currentLiRow = new Array();
    
    var liCount = 0;
	// Seperate li's into rows
	$(link).next("ul").find("> li:not(.last)").each(function () {

		var currentLi = $(this);

		if (liCount == liPerRow) {
			liTable.push(currentLiRow.slice());
			currentLiRow = new Array();
		    liCount = 1;
		} else {
		    liCount++;
		}
        
		currentLiRow.push(currentLi);
	});

	liTable.push(currentLiRow); // last row

	// Adjust heights for each individual row.
	for (var i = 0; i < liTable.length; i++) {

		// Find the maximum li height in row
		var maxHeight = 0;

		for (var j = 0; j < liTable[i].length; j++) {

            if (liTable[i][j].height() + 2 > maxHeight) {
                maxHeight = liTable[i][j].height() + 2;
            }
		}

		// Assign height diff as extra padding to all li's
		for (var j = 0; j < liTable[i].length; j++) {
            var liHeight = liTable[i][j].height();
            var heightDiff = 0;

            if (liHeight + 2 < maxHeight || j == liTable[i].length-1) {
                heightDiff = maxHeight - liHeight;
            }

			if (heightDiff > 0) {
				if (heightDiff < 10) {
                    heightDiff++;
                }
				liTable[i][j].css("margin-bottom", heightDiff + "px");

			}
		}
	}
}