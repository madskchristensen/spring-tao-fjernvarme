
var formId = $("body").data("formid");

if (formId) {
    (function ($, formId) {
        var contourFieldValues,
            recordValues = JSON.parse($("#values_" + formId).val()),
            fsConditions = JSON.parse($("#fsConditions_" + formId).val()),
            fieldConditions = JSON.parse($("#fieldConditions_" + formId).val()),
            form = $("#contour_form_" + formId);

        $(function () {
            $(".contourPage input, .contourPage textarea, .contourPage select", form).change(function () {
                PopulateFieldValues();
                CheckRules();
            });

            PopulateFieldValues();
            CheckRules();
        });

        function PopulateFieldValues() {
            PopulateRecordValues();

            $(".contourPage select", form).each(function () {
                contourFieldValues[$(this).attr("id")] = $("option[value='" + $(this).val() + "']", $(this)).text();
            });

            $(".contourPage textarea", form).each(function () {
                contourFieldValues[$(this).attr("id")] = $(this).val();
            });

            $(".contourPage input", form).each(function () {

                if ($(this).attr('type') == "text" || $(this).attr("type") == "hidden") {
                    contourFieldValues[$(this).attr("id")] = $(this).val();
                }

                if ($(this).attr('type') == "radio") {
                    if ($(this).is(':checked')) {
                        contourFieldValues[$(this).attr("name")] = $(this).val();
                    }
                }

                if ($(this).attr('type') == "checkbox") {

                    if ($(this).attr('id') != $(this).attr('name')) {
                        if ($(this).is(':checked')) {
                            if (contourFieldValues[$(this).attr("name")] == null) {
                                contourFieldValues[$(this).attr("name")] = $(this).val();
                            } else {
                                contourFieldValues[$(this).attr("name")] += "," + $(this).val();
                            }
                        }
                    } else {

                        contourFieldValues[$(this).attr("name")] = $(this).is(':checked').toString();
                    }
                }

            });
        }

        function PopulateRecordValues() {
            var fieldId;
            contourFieldValues = new Array();

            for (fieldId in recordValues) {
                if ($("#" + fieldId).length === 0) {
                    contourFieldValues[fieldId] = recordValues[fieldId];
                }
            }
        }

        function CheckRules() {
            umbracoForms.conditions.handle({
                fsConditions: fsConditions,
                fieldConditions: fieldConditions,
                values: contourFieldValues
            });
        }

    }(jQuery, formId));
}


