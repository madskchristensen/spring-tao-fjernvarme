$('.search-input').keypress(function (e) {
    var code = e.keyCode || e.which;
    if (code === 13) { //Enter keycode
        $(this).closest("form").submit();
        return false;
    }
});

$('.search-input').toAutoComplete({
    url: '/umbraco/openpublic/AutoCompleteApi/GetAutocomplete',
    jsonp: true,
    minLength: 3,
    select: function (event, data) {

        if (data.item) {
            $("form.search").submit();
        }
    }
});

$(".search-result-item").find("a").click(function () {
    var nodeId = $(this).parents(".search-result-item").find(".search-result-nodeid").val();
    var path = $(this).parents(".search-result-item").find(".search-result-path").val();
    var hostname = window.location.hostname;
    var searchword = $(this).parents(".search-result-item").find(".search-result-searchword").val();

    var dataToPost = {
        NodeId: nodeId,
        Searchword: searchword,
        Hostname: hostname,
        Path: path
    };

    $.ajax({
        //async: false,
        url: "/Umbraco/api/SearchStatisticApi/Post",
        type: "POST",
        dataType: "json",
        data: dataToPost
    });
});