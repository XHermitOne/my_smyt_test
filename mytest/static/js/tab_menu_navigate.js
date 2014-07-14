/**
 * Created by xhermit on 14.07.14.
 */

function on_table_menu_click(tab_name)
{
    //Обработчик клика на имени таблицы
    ajax_get_table_data(tab_name);
}

function ajax_get_table_data(tab_name)
{
    //Получить данные по таблице
    //Отправка Ajax запроса
    $.get("/ajaxgettable/"+tab_name+"/")
        .done(function(tab_data){
            //Получение ответа от сервера
            create_table_html(tab_data);
            });
}

function create_table_html(tab_data)
{
    //Создать таблицу
    //console.log(tab_data);

    //Очистить таблицу
    $('#table_records').empty();

    //Заполнить поля
    var newFields = $("<tr></tr>");

    for (var i=0; i < tab_data['scheme']['fields'].length; i++)
    {
        var field_title = tab_data['scheme']['fields'][i].title;
        //console.log(field_title);
        var newField = $("<td><div>"+field_title+"</div></td>");
        newFields.append(newField);
    }

    $('#table_records').append(newFields);

    //Заполнить данные таблицы
    for (var i=0; i < tab_data['records'].length; i++)
    {
        var record = tab_data['records'][i];
        var newRec = $("<tr></tr>");

        //console.log("1 "+record);
        for (var j=1; j < record.length; j++)
        {
            var field = tab_data['scheme']['fields'][j-1];
            var id = field['id']+"_"+record[0];
            var edit_type = field['type'];
            var cell_value = record[j];
            var field_name = field['id'];
            var rec_id = record[0];
            var tab_name = tab_data['scheme']['name'];

            //console.log("2 "+id+cell_value);

            var newCell = $("<td></td>");
            var newDiv = $("<div id=\""+id+"\" class=\"data_cell\" edit_type=\""+edit_type+"\" cell_value=\""+cell_value+"\" field_name=\""+field_name+"\" rec_id=\""+rec_id+"\" tab_name=\""+tab_name+"\">"+cell_value+"</div>");

            newDiv.mouseenter(function(e) {
                $(this).css("opacity", 0.5);
                }).mouseout(function(e) {
                $(this).css("opacity", 1.0);
                });
            newDiv.click(on_cell_edit);
            newCell.append(newDiv);
            newRec.append(newCell);

        }
        $('#table_records').append(newRec);
    }

    //Поля формы
    //console.log(tab_data['scheme']['title']);
    $('#form_title').text(tab_data['scheme']['title']+". Добавление записи:");
    $('#add_form').empty();
    for (var i=0; i < tab_data['scheme']['fields'].length; i++)
    {
        var field = tab_data['scheme']['fields'][i];
        var field_name = field['id'];
        var field_title = field['title'];
        var field_type = field['type'];

        var newP  = $("<p></p>");
        var newLabel = $("<label for=\"id_"+field_name+"\">"+field_title+":</label>");
        switch(field_type)
        {
            case "char":
                var newInput = $("<input class=\"char_field_form\" id=\"id_"+field_name+"\" name=\""+field_name+"\" type=\"text\" />");
                break;
            case "int":
                var newInput = $("<input class=\"int_field_form\" id=\"id_"+field_name+"\" name=\""+field_name+"\" type=\"number\" />");
                break;
            case "date":
                var newInput = $("<input class=\"datepicker\" id=\"id_"+field_name+"\" name=\""+field_name+"\" type=\"text\" />");
                var dates = newInput.datepicker({
                    defaultDate: "+1w",
                    dateFormat: "yy-mm-dd",
                    option: $.datepicker.regional['ru'],
                    changeMonth: true,
                    changeYear: true,
                    numberOfMonths: 1,
                    onSelect: function(selectedDate) {
                        var option = "minDate";
                        var instance = $(this).data("datepicker");
                        var date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
                        dates.not(this).datepicker("option", option, date);
                    }
                });
                break;
        }
        newP.append(newLabel);
        newP.append(newInput);
        //console.log(">>> "+field_type+newP.html());
        $('#add_form').append(newP);
    }
    var newButton = $("<input value=\"Добавить\" class=\"button\" type=\"button\" onclick=\"add_form_valid(\'"+tab_data['scheme']['name']+"\')\">");
    $('#add_form').append(newButton);
}
