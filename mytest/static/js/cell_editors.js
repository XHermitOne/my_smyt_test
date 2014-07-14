/**
 * Created by xhermit on 23.06.14.
 */

$(document).ready(function(){

    $(".data_cell").mouseenter(function(e) {
        $(this).css("opacity", 0.5);
        }).mouseout(function(e) {
        $(this).css("opacity", 1.0);
        });

    $(".data_cell").click(on_cell_edit);
});

function on_cell_edit(e)
{
    var editor_id=this.getAttribute("id");
    var rec_id=this.getAttribute("rec_id");
    var field_name=this.getAttribute("field_name");
    var tab_name=this.getAttribute("tab_name");
    var old_value = $(this).text();
    var edit_type = this.getAttribute("edit_type");

    switch(edit_type)
    {
        case "char":
            var newEditor = $('<input id="'+editor_id+'" class="char_edit" type="text" value="'+this.getAttribute("cell_value")+'" />');
            $(this).replaceWith(newEditor);
            $(".char_edit").change(function(){
                //Проверка на пустую строку
                var valid = true;
                if ($(this).val().trim()=="")
                {
                    window.alert("Пустое значение не допустимо");
                    valid = false;
                }
                if (/^<script>(.*?)<\/script>$/.test($(this).val().trim()))
                {
                    window.alert("Обнаружена инъекция");
                    valid = false;
                }

                if (valid == true)
                {
                    ajax_post_set(editor_id, edit_type, tab_name, rec_id, field_name, $(this).val(), old_value);
                }
            });
            break;
        case "int":
            var newEditor = $('<input id="'+editor_id+'" class="int_edit" type="number" value="'+this.getAttribute("cell_value")+'" />');
            $(this).replaceWith(newEditor);
            $(".int_edit").change(function(){
                //Простейшая валидация
                var int_value = parseInt($(this).val(),10);
                if (isNaN(int_value) | (int_value < 0))
                {
                    window.alert("Не корректное значение числового поля");
                }
                else
                {
                    ajax_post_set(editor_id, edit_type, tab_name, rec_id, field_name, $(this).val(), old_value);
                }
            });
            break;
        case "date":
            var newEditor = $('<input id="'+editor_id+'" class="datepicker" type="text" value="'+this.getAttribute("cell_value")+'" />');
            $(this).replaceWith(newEditor);
            var dates = $('.datepicker').datepicker({
                defaultDate: "+1w",
                dateFormat: "yy-mm-dd",
                option: $.datepicker.regional['ru'],
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                onSelect: function(selectedDate) {
                    ajax_post_set(editor_id, edit_type, tab_name, rec_id, field_name, selectedDate, old_value);
                }
            });
            newEditor.change(function(){
                //Проверка
                if (!(/^(\d{4})\-(0\d|1[012])\-([0-2]\d|3[01])$/.test($(this).val().trim())))
                {
                    window.alert("Не корректный формат даты");
                }
                else
                {
                    ajax_post_set(editor_id, edit_type, tab_name, rec_id, field_name, $(this).val(), old_value);
                }
            });
            break;
    }

}

function ajax_post_set(editor_id, edit_type, tab_name, rec_id, field_name, new_value, old_value)
{
    //Отправка Ajax запроса
    $.post('/ajaxset/', {tab_name: tab_name,
        rec_id: rec_id,
        field_name: field_name,
        new_value: new_value,
        old_value: old_value}, function(value){
            //Получение ответа от сервера
            var newDiv = $('<div id="'+editor_id+'" class="data_cell" edit_type="'+edit_type+'" cell_value="'+value+'" field_name="'+field_name+'" rec_id="'+rec_id+'" tab_name="'+tab_name+'">'+value+'</div>');
            //console.log("Test"+$('#'+editor_id).html());
            newDiv.mouseenter(function(e) {
                $(this).css("opacity", 0.5);
                }).mouseout(function(e) {
                $(this).css("opacity", 1.0);
                });

            newDiv.click(on_cell_edit);

            $('#'+editor_id).replaceWith(newDiv);
            });

};