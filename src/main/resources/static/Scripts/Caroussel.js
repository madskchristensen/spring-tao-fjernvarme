$(function () {
	
	var items = $(".campaign .slides .slide");
	var dots = null;
	var timeout = 7000;
	var fadeSpeed = 500;
	var current = 0;
	var size = items.length;
	var myTimer = window.setTimeout(myTimerEvent, timeout);
	var primary = true;

	$(".campaign .image img").load(imageLoaded);

	$(".campaign .image img.extra").css("display","none");

	items.each(function (index) {
		if (index == 0) {
			$(items[0]).addClass("active");
		}

		$('<div class="dot' + (index == 0 ? ' active' : '') + '" data-index="' + index.toString() + '"></div>').click(clickDot).appendTo($(".campaign .slides .dots"));
	});
	dots = $(".campaign .slides .dots .dot");

	function imageLoaded() {

	}

	function clickDot(e) {
		ShowItem(parseInt($(e.currentTarget).attr("data-index")));
	}

	function ShowItem(index) {
		current = index;
		primary = !primary;

		$(".campaign .image img." + (primary ? "primary" : "extra")).attr("src", $(items[current]).attr("data-image")).attr("alt", $(items[current]).attr("data-alt")).attr("aria-hidden", false);
	 //   console.log("ok");
		if (!primary) {
			$(".campaign .image img.extra").fadeIn(fadeSpeed);
		} else {
			$(".campaign .image img.extra").fadeOut(fadeSpeed);
		}

		dots.removeClass("active");
		$(dots[current]).addClass("active");

		items.removeClass("active");
		$(items[current]).addClass("active");

		window.clearTimeout(myTimer);
		myTimer = window.setTimeout(myTimerEvent, timeout);
	}

	function myTimerEvent() {
		ShowItem(current < size - 1 ? current + 1 : 0);		
	}


});