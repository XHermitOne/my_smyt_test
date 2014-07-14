/**
 * Created by xhermit on 03.07.14.
 */

function add_form_valid(cur_tab_name){
    var valid = true;
    //Проверка корректных данных при вводе в форму

    if ($(".char_field_form").length)
    {
        if ($(".char_field_form").val().trim()=="")
        {
            if (valid)
            {
                window.alert("Пустое значение не допустимо");
            }
            valid = false;
        }
        if (/^<script>(.*?)<\/script>$/.test($(".char_field_form").val().trim()))
        {
            if (valid)
            {
                window.alert("Обнаружена инъекция");
            }
            valid = false;
        }
    }

    if ($(".int_field_form").length)
    {
        var int_value = parseInt($(".int_field_form").val(), 10);
        if (isNaN(int_value))
        {
            if (valid)
            {
                window.alert("Не корректное значение числового поля");
            }
            valid = false;
        }
        if (int_value < 0)
        {
            if (valid)
            {
                window.alert("Отрицательное значение числового поля");
            }
            valid = false;
        }
    }

    if ($(".datepicker").length)
    {
        if ($(".datepicker").val().trim()=="")
        {
            if (valid)
            {
                window.alert("Необходимо заполнить дату");
            }
            valid = false;
        }
        if (!(/^(\d{4})\-(0\d|1[012])\-([0-2]\d|3[01])$/.test($(".datepicker").val().trim())))
        {
            if (valid)
            {
                window.alert("Неверный формат даты");
            }
            valid = false;
        }
    }

    if (valid)
    {
        var record = {};
        var char_fields = $(".char_field_form");
        var int_fields = $(".int_field_form");
        var date_fields = $(".datepicker");

        for (var i= 0; i < char_fields.length; i++)
        {
            record[char_fields[i].getAttribute("name")] =  $(char_fields[i]).val();
        }
        for (var i= 0; i < int_fields.length; i++)
        {
            record[int_fields[i].getAttribute("name")] =  $(int_fields[i]).val();
        }
        for (var i= 0; i < date_fields.length; i++)
        {
            record[date_fields[i].getAttribute("name")] =  $(date_fields[i]).val();
        }

        ajax_post_add_record(record, cur_tab_name);
    }

}

function ajax_post_add_record(record, cur_tab_name)
{
    //Отправка Ajax запроса
    $.post("/ajaxadd/"+cur_tab_name+"/", record)
        .done(function(new_record){
            //Получение ответа от сервера

            //После добавления записи очистить поля формы
            $(".char_field_form").val("");
            $(".int_field_form").val("");
            $(".datepicker").val("");

            //...и добавить запись в конец таблицы
            var newRec = $("<tr></tr>");

            for (var i=0; i < new_record['scheme'].length; i++)
            {
                var id = new_record['scheme'][i]['id']+"_"+new_record['data']['id'];
                var edit_type = new_record['scheme'][i]['type'];
                var cell_value = new_record['data'][new_record['scheme'][i]['id']];
                var field_name = new_record['scheme'][i]['id'];
                var rec_id = new_record['data']['id'];

                var newCell = $("<td></td>");
                var newDiv = $("<div id=\""+id+"\" class=\"data_cell\" edit_type=\""+edit_type+"\" cell_value=\""+cell_value+"\" field_name=\""+field_name+"\" rec_id=\""+rec_id+"\" tab_name=\""+cur_tab_name+"\">"+cell_value+"</div>");

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
            });

}
