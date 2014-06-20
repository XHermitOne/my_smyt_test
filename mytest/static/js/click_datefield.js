$(function() {
        $.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
		'Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		weekHeader: 'Не',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['ru']);

        var dates = $('#datepicker, #datepicker_to').datepicker({
                defaultDate: "+1w",
                dateFormat: "dd/mm/yy",
                option: $.datepicker.regional['ru'],
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                onSelect: function(selectedDate) {
                        var option = this.id == "datepicker" ? "minDate" : "maxDate";
                        var instance = $(this).data("datepicker");
                        var date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
                        dates.not(this).datepicker("option", option, date);
                }
        });
        //dates.datepicker($.datepicker.regional['ru']);
//        var dates2 = $('#datepicker2, #datepicker_to2').datepicker({
//                defaultDate: "+1w",
//                dateFormat: "dd/mm/yy",
//                option: $.datepicker.regional['ru'],
//                changeMonth: true,
//                changeYear: true,
//                numberOfMonths: 1,
//                onSelect: function(selectedDate) {
//                        var option = this.id == "datepicker2" ? "minDate" : "maxDate";
//                        var instance = $(this).data("datepicker");
//                        var date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
//                        dates2.not(this).datepicker("option", option, date);
//                }
//        });
})(django.jQuery);
