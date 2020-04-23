$(function () {

    $("#emailSubscriptionsForm").on("submit", function (e) {
        $("#subscriptionSubmitButton").attr("disabled", "disabled");

        var nodeId = $("#nodeId").val();
        var subscriberName = $("#subscriberName").val();
        var subscriberEmail = $("#subscriberEmail").val();

        if (subscriberEmail != null && subscriberName != null) {
            if (subscriberEmail.length > 0 && subscriberName.length > 0) {
                var url = $("#emailSubscriptionsForm").attr("action");
                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        nodeId: nodeId,
                        subscriberName: subscriberName,
                        subscriberEmail: subscriberEmail
                    },
                    success: emailSubscriptionSuccess,
                    error: emailSubscriptionError

                });

                e.preventDefault();
                return false;
            }
        }

        showEmailSubscriptionErrorMessage();
        $("#subscriptionSubmitButton").removeAttr("disabled");
        e.preventDefault();
        return false;
    });

    function emailSubscriptionSuccess(result) {

        if (result.data) {
            $("#emailSubscriptionsForm").hide();
        } else {
            //The subscrition was unsuccessfull
        }

        $("#subscriptionSubmitButton").removeAttr("disabled");
    }

    function emailSubscriptionError() {
        $("#subscriptionSubmitButton").removeAttr("disabled");
    }

    function showEmailSubscriptionErrorMessage() {
        
    }
});