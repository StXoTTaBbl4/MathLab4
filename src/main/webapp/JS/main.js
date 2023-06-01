const elt = document.getElementById('calculator');
const calculator = Desmos.GraphingCalculator(elt, {expressions: false, keypad: false});

let points;
let allX = [];
let allY = [];
let best_ap = 0;

let ui_input_n_warning = $('#ui-input-n-warning');
let x_values = $('#ui-input-x');
let y_values = $('#ui-input-y');
let ui_input_send_button = $('#ui-input-send-button');
let data_table = $('#data-table');

let response_obj;

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
    ui_input_send_button.css('display','none');
    ui_input_n_warning.html("");
    x_values.html("");
    y_values.html("");

    points = Math.abs(Math.round($('#ui-input-n').val()));
    if (points > 12 || points < 8){
        ui_input_n_warning.html("<p style='color: red'>Количество точек - от 8 до 12</p>");
        return;
    }
    console.log("points: " + points);

    ui_input_send_button.css('display','block');
    let buff;
    for(let i = 0; i < points; i++){
        buff = "x_"+(i+1);
        x_values.append("<div ><p>"+buff+"</p><input class='x_value' value='1' type='number' step='0.01'/></div>");
        buff = "y_"+(i+1);
        y_values.append("<div ><p>"+buff+"</p><input class='y_value' value='0' type='number' step='0.01'/></div>");
    }

});

//В гробах вертятся n поколенй аккуратного кода давая энергию всему городу
$('#data-table-save-button').on('click',function (){

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
});

$('#data-out-buttons-overview').on('click',function (){
    calculator.setBlank();
    data_table.html("");
    insertData(getTableNames("overview"),0);
    let arr = [
                ["a*x+b", "a0*x^2 + a1*x + a2 ","a*x^b","a*e^bx","a*ln(x)+b"],
                [response_obj.linearApproximation_SKO,
                 response_obj.squareApproximation_SKO,
                 response_obj.powerApproximation_SKO,
                 response_obj.exponentialApproximation_SKO,
                 response_obj.logarithmicallyApproximation_SKO,
                ]
                ];
    arr = transpose(arr);
    findBestAP(arr[1]);
    insertData(arr,1);

    drawDots(allX,allY,points);
    drawApproximationLine(response_obj.linearApproximation_a + '*x+' + response_obj.linearApproximation_b);
    drawApproximationLine(response_obj.squareApproximation_a_0 + '*x^2+' + response_obj.squareApproximation_a_1 +'*x+' +response_obj.squareApproximation_a_2);
    drawApproximationLine(response_obj.powerApproximation_a + '*(x*' + response_obj.powerApproximation_b + ')');
    drawApproximationLine(response_obj.exponentialApproximation_a + '*(\\e^x*' + response_obj.exponentialApproximation_b + ')');
    drawApproximationLine(response_obj.logarithmicallyApproximation_a + '*\\ln(x)+' + response_obj.logarithmicallyApproximation_b);

});

$('#data-out-buttons-linear').on('click',function (){
    calculator.setBlank();
    data_table.html("");
    $('#data-solo').html("<p>S ="+ response_obj.linearApproximation_S +"</p>" +
        "<p>\\(\\delta\\) ="+ response_obj.linearApproximation_SKO +"</p>"+
        "<p>a ="+ response_obj.linearApproximation_a +"</p>"+
        "<p>b ="+ response_obj.linearApproximation_b +"</p>");
    insertData(getTableNames("not-square"),0);
    let arr = [allX,allY,response_obj.linearApproximation_y,response_obj.linearApproximation_epsilon]
    arr = transpose(arr);
    insertData(arr,0);

    drawDots(allX,allY,points);
    drawApproximationLine(response_obj.linearApproximation_a + '*x+' + response_obj.linearApproximation_b);
    });

$('#data-out-buttons-square').on('click',function (){
    calculator.setBlank();
    data_table.html("");
    $('#data-solo').html("<p>S ="+ response_obj.squareApproximation_S +"</p>" +
        "<p>\\(\\delta\\) ="+ response_obj.squareApproximation_SKO +"</p>"+
        "<p>\\(a_{0}\\) ="+ response_obj.squareApproximation_a_0 +"</p>"+
        "<p>\\(a_{1}\\) ="+ response_obj.squareApproximation_a_1 +"</p>"+
        "<p>\\(a_{2}\\) ="+ response_obj.squareApproximation_a_2 +"</p>");
    insertData(getTableNames("square"),0);
    let arr = [allX,allY,response_obj.squareApproximation_y,response_obj.squareApproximation_epsilon]
    arr = transpose(arr);
    insertData(arr,0);

    drawDots(allX,allY,points);

    drawApproximationLine(response_obj.squareApproximation_a_0 + '*x^2+' + response_obj.squareApproximation_a_1 +'*x+' +response_obj.squareApproximation_a_2);
    });

$('#data-out-buttons-power').on('click',function (){
    calculator.setBlank();
    data_table.html("");
    $('#data-solo').html("<p>S ="+ response_obj.powerApproximation_S +"</p>" +
        "<p>\\(\\delta\\) ="+ response_obj.powerApproximation_SKO +"</p>"+
        "<p>a ="+ response_obj.powerApproximation_a +"</p>"+
        "<p>b ="+ response_obj.powerApproximation_b +"</p>");
    insertData(getTableNames("not-square"),0);
    let arr = [allX,allY,response_obj.powerApproximation_y,response_obj.powerApproximation_epsilon]
    arr = transpose(arr);
    insertData(arr,0);

    drawDots(allX,allY,points);
    drawApproximationLine(response_obj.powerApproximation_a + '*(x*' + response_obj.powerApproximation_b + ')');
    });

$('#data-out-buttons-exponential').on('click',function (){
    calculator.setBlank();
    data_table.html("");
    $('#data-solo').html("<p>S ="+ response_obj.exponentialApproximation_S +"</p>" +
        "<p>\\(\\delta\\) ="+ response_obj.exponentialApproximation_SKO +"</p>"+
        "<p>a ="+ response_obj.exponentialApproximation_a +"</p>"+
        "<p>b ="+ response_obj.exponentialApproximation_b +"</p>");
    insertData(getTableNames("not-square"),0);
    let arr = [allX,allY,response_obj.exponentialApproximation_y,response_obj.exponentialApproximation_epsilon]
    arr = transpose(arr);
    insertData(arr,0);

    drawDots(allX,allY,points);
    drawApproximationLine(response_obj.exponentialApproximation_a + '*(\\e^x*' + response_obj.exponentialApproximation_b + ')');
    });

$('#data-out-buttons-logarithmically').on('click',function (){
    calculator.setBlank();
    data_table.html("");
    $('#data-solo').html("<p>S ="+ response_obj.logarithmicallyApproximation_S +"</p>" +
        "<p>\\(\\delta\\) ="+ response_obj.logarithmicallyApproximation_SKO +"</p>"+
        "<p>a ="+ response_obj.logarithmicallyApproximation_a +"</p>"+
        "<p>b ="+ response_obj.logarithmicallyApproximation_b +"</p>");
    insertData(getTableNames("not-square"),0);
    let arr = [allX,allY,response_obj.logarithmicallyApproximation_y,response_obj.logarithmicallyApproximation_epsilon]
    arr = transpose(arr);
    insertData(arr,0);

    drawDots(allX,allY,points);
    drawApproximationLine(response_obj.logarithmicallyApproximation_a + '*\\ln(x)+' + response_obj.logarithmicallyApproximation_b);
    });

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
    response_obj = JSON.parse(json);
    console.log(response_obj);
    $('#data-in').css('display','none');
    $('#data-out').css('display','block');
    $('#data-out-buttons-overview').click();
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
            $('#file-input-warning').html("<p style='color: red'>Количество строк - 3</p>");
        }
        else {
            if (fileContentArray[0].split(" ").length != 1){
                $('#file-input-warning').html("<p style='color: red'>В первой строке - одно число(кол-во точек: 8 <= n <= 12)</p>");
                return;
            }
            if (fileContentArray[0].match(/[A-z]/) ||fileContentArray[1].match(/[A-z]/) || fileContentArray[2].match(/[A-z]/)){
                $('#file-input-warning').html("<p style='color: red'>В данных должны быть только числа</p>");
                return;
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
//

//наполнение таблицы данными
function insertData(data, flag){
    let table = document.querySelector('#data-table');

    for (let subArr of data) {
        let tr = document.createElement('tr');

        for (let elem of subArr) {
            let td = document.createElement('td');
            if (typeof elem === 'number' && elem == best_ap && flag==1){
                td.style.background = '#4CAF50 ';
            }
            td.textContent = (typeof elem === 'number' ? Math.round(elem*100000)/100000 : elem);
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    MathJax.typeset();
}

//Заголовочные строки для таблицы
function getTableNames(method){
    switch (method){
        case "overview":{
            return [["Function","\\(\\delta\\)"]]
        }
        case "not-square":{
            return [["X","Y","P","\\(\\epsilon\\)"]];
        }
        case "square":{
            return [["X","Y","P","\\(\\epsilon\\)"]];
        }

    }
}

function drawDots(x,y,n){
    for (let i = 0; i < n; i++) {
        calculator.setExpression({
            latex: '('+x[i] + ',' + y[i] + ')',
            pointStyle: 'POINT',
            color: 'red',
        });
    }
}

function drawApproximationLine(expression){
    calculator.setExpression({
        latex: expression,
    });
}

//Транспонирование матрицы результатов работы(на стороне серва делать лень было)
function transpose(matrix) {
    return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
}

//ради одной фунцкии отдельный файл - силшком много чести
function popupFunction() {
    document.getElementById("myPopup").classList.toggle("show");
}

function findBestAP(array){

    best_ap = Number.MAX_VALUE;
    for (let i = 0; i < array.length; i++) {
        if (array[i] < best_ap)
            best_ap = array[i];
    }

}