
//Functions
//------------------------------

genericAccordion();
callToActionTexts();
toggleAccessibility();
toggleMoreContrast();

    console.log("Doc ready...");

//Document Ready
//------------------------------
$(document).ready(function () {

    if ($("html").hasClass("no-touch")) {
        setBlockHeights();
    } else {
        focusBoxHeightOnTouch();
    }

    $(".icon-print").click(function (e) {
        e.preventDefault();

        window.print();
        return false;
    });


    removeEmptyTagsForEsdhContent($(".esdh-agenda-section-content"));
});

function removeEmptyTagsForEsdhContent(item) {
    item.find("span").each(removeIfEmptyAndeRemoveStyle);
    item.find("p").each(removeIfEmptyAndeRemoveStyle);
    item.find("li").each(removeIfEmptyAndeRemoveStyle);
    item.find("style").remove();
}

function removeIfEmptyAndeRemoveStyle() {
    var $this = $(this);
    if ($this.html().replace(/\s|&nbsp;/g, '').length == 0) {
        $this.remove();
    }
    $this.removeAttr("style");
}

function genericAccordion() {

    $(".borger-content").find("h2").click(function (e) {
        e.preventDefault();
        $(this).toggleClass("open");
        $(this).next("div").slideToggle(400);
    });
    $(".borger-content").find(".trigger").click(function (e) {
        e.preventDefault();
        $(this).toggleClass("open");
        $(this).next("div").slideToggle(400);
    });

    $(".accordion-header").click(function (e) {
        e.preventDefault();

        //$(".accordion").children(".open").toggleClass("open").next("div").slideToggle(400)
        $(this).toggleClass("open").next("div").slideToggle(400);
    });

}

function callToActionTexts() {

    var totalCTACount = $(".calltoactiontext").length;
    $(".calltoactiontext").each(function (index) {

        var link = $(this).children("a:first");

        if ($(this).is("a")) {
            link = null;
        }

        if (link != null && link.is("a")) {
            link.addClass("calltoactiontext");
        } else {
            var pTag = $("<p>", {
                'class': "calltoactiontext"
            });
            pTag.append($(this).html());
            $(this).html(pTag);
        }
        $(this).removeClass("calltoactiontext");
        $(this).addClass("calltoaction");

        if (!$(this).next().hasClass("calltoactiontext")) {

            $('<div class="clearfix"></div>').insertAfter($(this));
        }
    });
}

function setBlockHeights() {
    var blocks = $(".box-item.jsSetBlockHeight, .list-item.blockList");
    var heighestHeight = 0;
    var sawImage = false;

    var getHighestBlockHeight = function () {
        var heighestHeight = 0;
        blocks.each(function () {

            sawImage = false; // Reset for every iteration

            if ($(this).parent().hasClass("right-content")) {
                return;
            }
            var blockHeight = $(this).height();
            var blockWidth = $(this).width();

            if (!sawImage) {
                var images = $(this).find("img");
                console.log("Saw image: setting width as: " + blockWidth);

                images.each(function () {
                    $(this).css("max-height", blockWidth);
                    $(this).css("max-width", blockWidth);
                });

                sawImage = images.length > 0;
            }

            // Setup case: Headline + image (NO paragraph)
            var imageWithHeadlineAndNoParagraph = $(this).children("img").length > 0 && $(this).children(".BlockTextImageSansTextHeader").length > 0;
            if (imageWithHeadlineAndNoParagraph) {
                console.log("Setup case: setting width as: " + blockWidth);
                images.each(function () {
                    $(this).css("height", blockWidth);
                    $(this).css("width", blockWidth);
                });
            }

            if (blockHeight >= heighestHeight) {
                heighestHeight = blockHeight;
            }
        });

        return heighestHeight;
    };


    var setAllBlockHeight = function (newHeight) {
        if (newHeight > 0) {
            $(".box-item, .list-item").each(function () {
                var parent = $(this).parent();
                if (!parent.hasClass("right-content")) {
                    parent.height(newHeight);
                }
            });
        }
    };

    heighestHeight = getHighestBlockHeight();

    if (sawImage) {
        setTimeout(function () {
            heighestHeight = getHighestBlockHeight();
            setAllBlockHeight(heighestHeight);
        }, 100);
    } else {
        setAllBlockHeight(heighestHeight);
    }
}

function toggleAccessibility() {
    var accessibilityButton = $("a.icon-font-size");

    if (accessibilityButton.hasClass("on")) {
        $("body").addClass("accessibility");
    }
    else {
        $("body").removeClass("accessibility");
    }
}


function toggleMoreContrast() {
    var accessibilityButton = $("a.icon-brightness-contrast");

    if (accessibilityButton.hasClass("on")) {

        $("body").addClass("more-contrast");
    }
    else {
        $("body").removeClass("more-contrast");
    }
}

function focusBoxHeightOnTouch() {
    $(".triggerForTouchDevices").addClass("SpecialRulesForTouch");
}