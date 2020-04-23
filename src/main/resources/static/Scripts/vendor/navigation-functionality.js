//-----------------------------------------------------
//Open Public 
//Navigation Functionality 
//By Mediaworkers 2013
//-----------------------------------------------------

(function ($) {
	$.fn.opMenu = function (options) {
		var selector = $("#mega-menu");
		var selection = $(this);

		// Default settings
		var settings = $.extend({
			activeContainerClass: "selected",
			addingActiveContainerClass: "selected-entering",
			removeingActiveContainerClass: "selected-exiting",
			transformingAncestorContainerClass: "pre-previous",
			activeSubContainerClass: "expanded",
			activeAncestorSubContainerClass: "previous",
			loadingItemsContainerClass: "loading",
			onClose: null,
			onActivate: null,
			onItemsLoad: null,
			onItemsLoaded: null
		}, options);


		//CLOSE NAVIGATION ON CLICK AND TOUCH
		var touchMove = false;

		$(document).bind("touchmove", function (e) {
			setTouchState(false);
		});

		$(document).bind("touchstart", function (e) {
			setTouchState(true);
		});

		$(document).bind("click touchend", function (e) {

			if (touchMove != true) {
				closeMenuIfOpen(e, e.target);
			}
		});


		//DETECT MOVE ON TOUCH - SO WE DONT CLOSE THE MENU WHEN A USER IS SCROLLING ON TOUCH DEVISES
		function setTouchState(state) {


			if ($(selector).hasClass("expanded")) {

				if ($(e.target).parents("#navigation").length == 0 && $(e.target).not("#navigation")) {

					if (!$(e.target).is("#open-current-page-in-menu")) {
						touchMove = state;
					}
				}
			}

		}


		//CLOSE THE NAVIGATION
		function closeMenuIfOpen(e, target) {

			

			if ($(selector).hasClass("expanded")) {

				if ($(e.target).parents("#navigation").length == 0 && $(e.target).not("#navigation")) {

					if (!$(e.target).is("#open-current-page-in-menu")) {
						
						if (settings.onClose != null) {
							settings.onClose(close);
						} else {
							close();
						}
					}

				}
			}
		}

		//REMOVE CLASSES ON CLOSE
		function close() {

			$(selector).removeClass("active");
			
			$(selection).find("." + settings.activeContainerClass
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
		}


		return this.each(function () {

			var menu = $(selection);




			/* TEMP - ONLY TO USE ON LOCAL SOLUTION --------------------------- */
			/*
			$(menu).find("li > ul").each(function () {
				if ($(this).children().length > 0) {
					$(this).parent().addClass("expandable");
				} else {
					$(this).parent().removeClass("expandable");
				}

				$(menu).find("li > a").each(function () {

					// find items with data-item-src
					if ($(this).data("items-src") != null) {
						$(this).parent().addClass("expandable");
					}

				});
			});
			/* TEMP ends ----------------------------------------------------- */





			$(menu).on("click", ".expandable > a", function (e) {

				e.preventDefault();
				
				$(selector).addClass("active");

				var link = $(this);
				var fetchUrl = $(link).data("items-src");

				if (fetchUrl != null) {
					// Get menu from server before activating
					//initSetActiveMenuItem(menu, $(link));
					getItemsFromSource(menu, $(link), function () {
						initSetActiveMenuItem(menu, $(link));
					});
				} else {
					initSetActiveMenuItem(menu, $(link));
				}

			});

		});


		// UTIL FUNCTIONS
		function initSetActiveMenuItem(menu, item) {
			var link = $(item);
			var container = $(link).parent();

			// Set active
			$(container).parents("ul:first").add($(container).find("ul." + settings.transformingAncestorContainerClass)).removeClass(settings.transformingAncestorContainerClass);
			$(container).addClass(settings.activeContainerClass).addClass(settings.addingActiveContainerClass)
				.parents("ul:first").parents("ul:first").addClass(settings.transformingAncestorContainerClass);


			$(container).find("ul." + settings.activeSubContainerClass).not("." + settings.activeAncestorSubContainerClass)
				.find("li." + settings.activeContainerClass).addClass(settings.removeingActiveContainerClass);

			if (settings.onActivate != null) {
				settings.onActivate(link, function () {
					setActiveMenuItem(menu, link);
				});
			} else {
				setActiveMenuItem(menu, link);
			}

		}

		function setActiveMenuItem(menu, item) {
			var link = $(item);
			var container = $(link).parent();

			// Remove selected enter & exiting state
			$(container).removeClass(settings.addingActiveContainerClass);
			$("." + settings.removeingActiveContainerClass).removeClass(settings.removeingActiveContainerClass);


			// Remove current active
			$(menu).find("." + settings.activeContainerClass).filter(function () {
				return $(this).find(container).length == 0;
			}).not(container).removeClass(settings.activeContainerClass);

			// Set active parents
			$(container).parents("ul:first").addClass(settings.activeSubContainerClass).removeClass(settings.activeAncestorSubContainerClass);

			// Remove current active heirachy
			$(menu).find("ul").filter(function () {
				return $(this).find("." + settings.activeContainerClass + ":first").length == 0;
			}).removeClass(settings.activeSubContainerClass).removeClass(settings.activeAncestorSubContainerClass);

			// Set active heirachy
			$(container).parents("li").each(function () {

				$(this).addClass(settings.activeContainerClass)
					.parents("ul:first").addClass(settings.activeSubContainerClass + " " + settings.activeAncestorSubContainerClass);
			});
		}

		function getItemsFromSource(menu, link, complete) {
			$(link).parent().addClass(settings.loadingItemsContainerClass);

			if (settings.onItemsLoad)
				settings.onItemsLoad(link);

			$.get($(link).data("items-src"))
				.done(function (data) {
					if (settings.onItemsLoaded)
						settings.onItemsLoaded(link, true);

					$(link).parent().append(data);
					$(link).removeData("items-src").removeAttr("data-items-src");

					complete();
				})
				.fail(function () {
					if (settings.onItemsLoaded)
						settings.onItemsLoaded(link, false);
				}).always(function () {
					$(link).parent().removeClass(settings.loadingItemsContainerClass);
				});
		}

	};
}(jQuery));

