var touchNavOpen = false;
var desktopNavOpen = false;
var desktopEnabled = $(window).width() + 15 > 768 ? true : false;

$(document).click(function (e) {
	
	if($("#navigation").hasClass("nav-is-shown"))
	{			
		
		if ($(e.target).parents("#navigation").length == 0 && $(e.target).not("#navigation, .show-navigation")) {
			
			toggleCollapseNavigation();
		}
	}
		
});



//MENU BUTTON TRIGGER ON SMALL SCREEN DEVICES ----------------//
$(".menu-trigger").on("mouseup", function(){
	
	if(touchNavOpen)
	{
		closeTouchNav(true);
	}
	else
	{
		openTouchNav();
	}
	
});

function toggleCollapseNavigation()
{
	
	if($("#navigation").hasClass("nav-is-shown"))
	{
		$("#navigation").removeClass("nav-is-shown");
		
		setTimeout(function(){
			
			
			$("#mega-menu").fadeOut(250, function(){
				$(".show-navigation").fadeIn(250);
			});
		}, 250);
	}		
	
	else
	{
		$("#navigation").addClass("nav-is-shown");
		
		$(".show-navigation").hide();
		$("#mega-menu").show();	
		
	}
	
}

//OPEN TOUCH NAVIGATION ---------- //
function openTouchNav()
{
	$("#navigation").addClass("is-shown");
	$("#navigation").toggle( "blind", {}, 500);
	
	touchNavOpen = true;
}

//CLOSE TOUCH NAVIGATION ---------- //
function closeTouchNav(animate)
{
	$("#navigation").removeClass("is-shown");
	
	if(animate)
	{
		$("#navigation").toggle( "blind", {}, 500);
	}
	
	touchNavOpen = false;
}