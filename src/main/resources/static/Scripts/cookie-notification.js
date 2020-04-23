//-----------------------
//Cookie Notification
//By Mediaworkers 2013
//-----------------------

$(function () {

	var containerId = "#cookie-notification";

	//Detect if browser supports HTML5 storage. Note: IE7 is not supported.
	if (typeof (Storage) !== "undefined") {

		//Dont show the notification box, if the browser has localStorage data with the name "userAcceptsCookies" .
		if (localStorage.getItem('userAcceptsCookies'))
			return;


		//Show the notification box
		$(containerId).show().animate({
			"bottom": "0px"
		});
			
		
		//On button click, set local storage and hide the notification box
		$(containerId + " button").click(function (e) {

			e.preventDefault();
			
			localStorage.setItem('userAcceptsCookies', 'yes');
			
			//Animate
			$(containerId).animate({
				"bottom": "-200px"
			}, function () {
				$(containerId).hide();
			});
				
		});
	}

	//If browser does not support HTML5 storage.
	else {
		//alert("Din browser understøtter ikke (html storage)");
		$(containerId).show().css("bottom", "0px");
	}

});


//Remove local storage data
$(".remove-local-storage").click(function () {
	
	localStorage.removeItem("userAcceptsCookies")

});
