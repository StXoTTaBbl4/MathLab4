const elt = document.getElementById('calculator');
const calculator = Desmos.GraphingCalculator(elt, {expressions: false, keypad: false});

let points;
let allX = [];
let allY = [];

let ui_input_n_warning = $('#ui-input-n-warning');
let x_values = $('#ui-input-x');
let y_values = $('#ui-input-y');

//Инициализация для графиков ака костыль номер 0
$(document).ready(function(){
    // calculator.setExpression({ latex: '(x^2*y^2)^2 = 2*2.6^2*(x^2+y^2)' });
    calculator.setExpression({ latex: '(x^2+y^2)^2 = 2*2.6^2*(x^2-y^2)' });
    // calculator.setExpression({
    //     id: "test_point",
    //     type: "expression",
    //     latex: "(0,0)",
    //     pointStyle: "POINT",
    //     hidden: false,
    //     secret: false,
    //     color: "gray",
    //     parametricDomain: {min: "0", max: "1"},
    //
    //     label: "Я просто точка",
    //     showLabel: true
    //   });

});

$('#file-button').on('click',function (){
    $('#data-in-buttons').css('display','none');
    $('#file-input').css('display','block');
});

$('#ui-button').on('click',function (){
    $('#data-in-buttons').css('display','none');
    $('#ui-input').css('display','block');
});

$('#ui-input-send-button').on('click',function () {
    for (let i = 0; i < points; i++) {
        allX[i] = $('.x_value')[i].value;
        allY[i] = $('.y_value')[i].value;
    }
    sendData();
});

$('#upload-file').on('change',function (evt){
    $('#file-input-warning').html("");
    getFile(evt);
});

$('#ui-input-n').on('input',function () {
    $('#ui-input-send-button').css('display','none');
    ui_input_n_warning.html("");
    x_values.html("");
    y_values.html("");

    points = Math.abs(Math.round($('#ui-input-n').val()));
    if (points > 12 || points < 8){
        ui_input_n_warning.html("<p style='color: red'>Количество точек - от 8 до 12</p>");
        return;
    }
    console.log("points: " + points);

    $('#ui-input-send-button').css('display','block');
    let buff;
    for(let i = 0; i < points; i++){
        buff = "x_"+(i+1);
        x_values.append("<div ><p>"+buff+"</p><input class='x_value' value='1' type='number' step='0.01'/></div>");
        buff = "y_"+(i+1);
        y_values.append("<div ><p>"+buff+"</p><input class='y_value' value='0' type='number' step='0.01'/></div>");
    }

});

//В гробах вертятся n поколенй аккуратного кода давая энергию всему городу
$('#saveData').on('click',function (){

    let csv_data = [];

    let rows = document.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {

        let cols = rows[i].querySelectorAll('td,th');

        let csvrow = [];
        for (let j = 0; j < cols.length; j++) {
            csvrow.push(cols[j].innerHTML);
        }

        csv_data.push(csvrow.join(","));
    }
    csv_data = csv_data.join('\n');

    let CSVFile = new Blob([csv_data], { type: "text/csv" });


    let temp_link = document.createElement('a');


    temp_link.download = "data.csv";
    temp_link.href = window.URL.createObjectURL(CSVFile);

    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    temp_link.click();
    document.body.removeChild(temp_link);
})

function sendData() {
    let obj = {
        points,
        allX,
        allY
    };
    console.log(JSON.stringify(obj));

    $.ajax({
        url: 'process-servlet',
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(obj),
        dataType: "html",

        success(msg){
            console.log(msg);
            receiveData(msg);
        },
        error(msg){
            console.log(msg)
        }
    });
}

function receiveData(json){
    const obj = JSON.parse(json);
    console.log(obj);
    $('#data-in').css('display','none');
    $('#data-out').css('display','block');
}



//Чтение из файла
function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        placeFileContent(input.files[0])
    }
}
function placeFileContent(file) {
    readFileContent(file).then(content => {
        let fileContentArray = content.split(/\r\n|\n/)

        if (fileContentArray.length != 3){
            $('#loadWarning').html("<p style='color: red'>Количество строк - 3</p>");
        }else {
            if (fileContentArray[0].split(" ").length != 1){
                console.log("error here")
                $('#file-input-warning').html("<p style='color: red'>В первой строке - одно число(кол-во точек: 8 <= n <= 12)</p>");
                return;
            }
            if (fileContentArray[0].match(/[A-z]/) ||fileContentArray[1].match(/[A-z]/) || fileContentArray[2].match(/[A-z]/)){
                $('#file-input-warning').html("<p style='color: red'>В данных должны быть только числа</p>");
            }

            points = Math.abs(Math.round(fileContentArray[0].replaceAll(",",".").split(" ")[0]));
            allX = fileContentArray[1].replaceAll(",",".").split(" ");
            allY = fileContentArray[2].replaceAll(",",".").split(" ");
            if ((allX.length != points) || (allY.length != points)){
                $('#file-input-warning').html("<p style='color: red'>Количество элементов строк 2 и 3 должно соответствовать колчиеству точек</p>");
                return;
            }
            console.log(allX);
            console.log(allY);
            sendData();
        }
    }).catch(error => console.log(error))

}
function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}
function checkInput(input){
    let buff
    for (let i = 0; i < input.length; i++) {
        buff = input[i];
        if (buff.split(" ").length > 1){
            return false
        }
    }
    return true
}
//

//наполнение таблицы данными
function insertData(data){
    let table = document.querySelector('#data-table');

    for (let subArr of data) {
        let tr = document.createElement('tr');

        for (let elem of subArr) {
            let td = document.createElement('td');
            td.textContent = (typeof elem === 'number' ? Math.round(elem*100000)/100000 : elem);
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
}

//Заголовочные строки для таблицы
function getTableNames(method){
    switch (method){
        case "half":{
            return [["i","a","b","x","F(a)","F(b)","F(x)","\|a+b\|"]];
        }
        case "sec":{
            return [["i","\\(x_{i-1}\\)","\\(x_i\\)","\\(x_{i+1}\\)","\\(F(x_{i+1})\\)","\\(x_{i+1} - x_i\\)"]];
        }
        case "iter":{
            return [["i","\\(x_i\\)","\\(x_{i+1}\\)","\\(\\Phi(x_{i+1})\\)","\\(F(x_{i+1})\\)","\\(x_{i+1} - x_i\\)"]];
        }
        case "newton":{
            return [["i","\\(x_i\\)","\\(y_i\\)","\\(\\delta x\\)","\\(\\delta y\\)","\\(x_{i+1} - x_i\\)","\\(y_{i+1} - y_i\\)"]];
        }
        case "newton":{
            return [["i","\\(x_i\\)","\\(y_i\\)","\\(\\delta x\\)","\\(\\delta y\\)","\\(x_{i+1} - x_i\\)","\\(y_{i+1} - y_i\\)"]];
        }

    }
}

//ради одной фунцкии отдельный файл - силшком много чести
function popupFunction() {
    document.getElementById("myPopup").classList.toggle("show");
}