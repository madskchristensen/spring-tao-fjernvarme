
$(function () {
    "use strict";

    ////Når der bliver ændret i Udvalg dropdown.
    //$('#mwop_EsdhAgendaSelection .Esdh_committeeDropDown').change(function () {
    //    //Hvis den valgte option er den første, altså den tomme, så gem Datoboxen
    //    if ($(this).find(":selected").val() == "") {
    //        $("#mwop_EsdhAgendaSelection .Esdh_dateDropDown").empty().attr('disabled', true);
    //        $("#mwop_EsdhAgendaSelection .Esdh_selectedDateHiddenField").val("");
    //        return;
    //    }
    //    //Hent datoer til et Udvalg via ajax fra handleren GetDates, 
    //    $.ajax({
    //        type: "GET",
    //        url: "/Umbraco/openpublic/EsdhDates/Get?comitteeId=" + $(this).find(":selected").val(),
    //        dataType: "json",
    //        contentType: "application/json",
    //        processData: false,

    //        success: function (msg) {
    //            //hvis resultaterne i dropdownBoxen. tøm dem først.
    //            $("#mwop_EsdhAgendaSelection .Esdh_dateDropDown").empty().removeAttr('disabled');
    //            $("#mwop_EsdhAgendaSelection .Esdh_dateDropDown").append(new Option("", ""));
    //            //Formatere DateTime fra C# over til at jQuery kan sende det ind i listen.
    //            $.each(msg, function (key, value) {
    //                //Cutter de første 6 tegn af fra value, for at få ordenlig dato.
    //                var substr = value.substr(0, 10);

    //                var date = new Date(substr);
    //                var dateFormatted = AddZero(date.getDate()) + "." + AddZero(date.getMonth() + 1) + "." + AddZero(date.getFullYear());
    //                //Indsætter datoen i DateDropDown
    //                //$("#mwop_EsdhAgendaSelection .Esdh_dateDropDown")
    //                //	.append(new Option(dateFormatted, dateFormatted));
    //                var o = new Option(dateFormatted, dateFormatted);
    //                /// jquerify the DOM object 'o' so we can use the html method
    //                $(o).html(dateFormatted);
    //                $("#mwop_EsdhAgendaSelection .Esdh_dateDropDown").append(o);
    //            });
    //        }
    //    });

    //});
    //Hvis der bliver valgt en Dato i DatoDropDown.
    $('#mwop_EsdhAgendaSelection .Esdh_dateDropDown').change(function () {
        //Sæt SelectedDateHiddenField, som behjælper med at kunne holde state i .net, iforhold til at vi sætter DateDropDown via jQuery
        $("#mwop_EsdhAgendaSelection .Esdh_selectedDateHiddenField").val($(this).val());
    });

    $.each($(".esdh-agenda-section-content"), function (index, value) {
        if (value.innerText === undefined || value.innerText.trim() === undefined || value.innerText === "") {
            $(value).parent(".esdh-agenda-section").hide();
        }

    });

});
//funktion til at sætte 0 foran måneder fra 1-9asd
function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

