/* Тестовая функция */
function test()
{
    window.alert("OK");
}


$(document)
function onClickCell(sFieldName, sFieldType, sValue, iRecID)
{
    //window.alert(">>>"+sFieldName+sFieldType+sValue+iRecID);
    switch (sFieldType)
    {
        case "char":
            //ctrl = '<div><input type="text" class="field" name="dynamic[]" value="0" /></div>'
            $(document).ready(function($))
            {
                var cell_id = sFieldName+"_"+iRecID;
                var cell = document.getElementById(cell_id);
                if (cell)
                {
                    window.alert("OK"+cell_id);
                }
            }
        case "int":
        case "date":

    }

}