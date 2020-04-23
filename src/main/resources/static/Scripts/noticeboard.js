//Document is ready
$(function () {


    var noticeBoardContainer = $("#noticeboard");

    if ($(noticeBoardContainer).length > 0) {

        $(noticeBoardContainer).find("form").validate();

        $(noticeBoardContainer).find("form").on("submit", function (e) {

            e.preventDefault();
            
            if ($(noticeBoardContainer).find("form").first().valid()) {
                
                var apiUrl = "/Umbraco/Api/NoticeboardApi/SaveMessage";

                var listId = $(noticeBoardContainer).attr("data-listId");
                var name = $(noticeBoardContainer).find("input.notice-name").val();
                var headline = $(noticeBoardContainer).find("input.notice-headline").val();
                var message = $(noticeBoardContainer).find("textarea.notice-message").val();
                message = message.replace(/\r\n|\r|\n/g, "<br />");
                message = message + "<span class='author'>Skrevet af: " + name + " </span>";

                $(noticeBoardContainer).find("input, textarea, button").prop("disabled", true);

                var loadingText = $(noticeBoardContainer).find("button").attr("data-loading-text");
                $(noticeBoardContainer).find("button").text(loadingText);

                $.ajax({
                    url: apiUrl,
                    data: { listId: listId, name: name, headline: headline, message: message },
                    type: "GET",
                    success: function (data) {
                        

                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                    },
                    error: function (data) {
                        $(noticeBoardContainer).find("input, textarea, button").prop("disabled", false);
                        $(noticeBoardContainer).find("button").text("Opret opslag");

                        $(noticeBoardContainer).append('<span>Der skete en fejl, tjek at alle felter er udfyldt og prøv igen.</span>');
                    }
                });
            }
        });
    }


});