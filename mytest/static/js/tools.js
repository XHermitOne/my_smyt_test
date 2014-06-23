/* Тестовая функция */
function test()
{
    window.alert("OK");
}

function clickCell(sFieldName, sFieldType, sValue, iRecID)
{
    //window.alert(">>>"+sFieldName+sFieldType+sValue+iRecID);
    if (sFieldType == 'char')
    {
        ctrl = '<div><input type="text" class="field" name="dynamic[]" value="0" /></div>'
    }
    if (sFieldType == 'int')
    {

    }
    if (sFieldType == 'date')
    {

    }

}