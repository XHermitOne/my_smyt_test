/**
 * Created by xhermit on 23.06.14.
 */

$(document).ready(function(){

    $(".data_cell").mouseenter(function(e) {
        $(this).css("opacity", 0.5);
        }).mouseout(function(e) {
        $(this).css("opacity", 1.0);
        });

    $(".data_cell").click(function(e){
        var editor_id=this.getAttribute("id");
        var rec_id=this.getAttribute("rec_id");
        var field_name=this.getAttribute("field_name");
        var tab_name=this.getAttribute("tab_name");
        var old_value = $(this).text();

        switch(this.getAttribute("edit_type"))
        {
            case "char":
                var newEditor = $('<input id="'+editor_id+'" class="char_edit" type="text" value="'+this.getAttribute("cell_value")+'" />');
                $(this).replaceWith(newEditor);
                $(".char_edit").change(function(){
                    //Проверка на пустую строку
                    if ($(this).val().trim()=="")
                    {
                        window.alert("Пустое значение не допустимо");
                    }
                    else
                    {
                        $.post('/set/', {tab_name: tab_name,
                                        rec_id: rec_id,
                                        field_name: field_name,
                                        new_value: $(this).val(),
                                        old_value: old_value}, function(data){
                            window.alert("Test"+data);
                        });
                    }
                });
            case "int":
                var newEditor = $('<input id="'+editor_id+'" class="int_edit" type="number" value="'+this.getAttribute("cell_value")+'" />');
                $(this).replaceWith(newEditor);
                $(".int_edit").change(function(){
                    //Простейшая валидация
                    var int_value = parseInt($(this).val(),10);
                    if (isNaN(int_value))
                    {
                        window.alert("Не корректное значение числового поля");
                    }
                    else
                    {
                        //Перейти на страницу
                        location.assign("/update/"+tab_name+"/"+rec_id+"/"+field_name+"/"+$(this).val()+"/");
                    }
                });
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
                            location.assign("/update/"+tab_name+"/"+rec_id+"/"+field_name+"/"+$(this).val()+"/");
                }
                });
        }



    });
});

