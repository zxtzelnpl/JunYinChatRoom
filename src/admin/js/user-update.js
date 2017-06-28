$(function () {

    // add uniform plugin styles to html elements
    $("input:checkbox, input:radio").uniform();

    // select2 plugin for select elements
    $(".select2").select2({
        placeholder: "Select a State"
    });

    // datepicker plugin
    $('.datepicker').datepicker().on('changeDate', function (ev) {
        $(this).datepicker('hide');
    });

    // wysihtml5 plugin on textarea
    $(".wysihtml5").wysihtml5({
        "font-styles": false
    });
});
