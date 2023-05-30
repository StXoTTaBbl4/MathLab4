<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Calendar" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>WebLab4Front</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="images/favicon.png">
    <link rel="stylesheet" href="CSS/w3.css">
    <link rel="stylesheet" href="CSS/popup.css">
    <script src="JS/calculator.js"></script>

    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="JS/lib/tex-mml-chtml.js"></script>
</head>
<body class="mat-typography">
<header class="w3-container w3-teal">
    <span class="w3-show-inline-block">
        <img src="images/fQDTLJ3zhzU.jpg" alt="logo" height="100px"/>
    </span>
    <span class="w3-show-inline-block">
        <h3>Лабораторная работа #2, Вариант #21, Румский А.М. Р32121</h3>
    </span>
</header>

<div class="w3-half w3-right" id="data">
    <div id="data-in">
        <div id="data-in-buttons">
            <p><button id="file-button" class="w3-button w3-round w3-xxlarge">Ввод из файла</button></p>
            <p><button id="ui-button" class="w3-button w3-round w3-xxlarge">Ввод через UI</button></p>
        </div>

        <div id="file-input" style="display: none">
            <p>
                Формат данных в файле:<br>
                N - число точек<br>
                x_i - аргументы ф-ии<br>
                y_i - значения ф-ии
            </p>
            <div class="popup" onclick="popupFunction()">Пример(тык)
                <span class="popuptext" id="myPopup">
                     9<br>
                     0 1 2 3 4 5 6 7 8 <br>
                     0 1 2 3 4 5 6 7 8
                </span>
            </div>

            <div id="file-input-warning"></div>
            <input type="file" id="upload-file">
        </div>

        <div id="ui-input" style="display: none">
            <div style="display: inline-block">
                <div id="ui-input-n-warning"></div>
                <input id="ui-input-n" type="number" step="1" placeholder="8..12"/>
            </div>

            <div style="display: inline-block">
                <div id="ui-input-x-warning"></div>
                <div id="ui-input-x" ></div>
            </div>

            <div style="display: inline-block">
                <div id="ui-input-y-warning"></div>
                <div id="ui-input-y" ></div>
            </div>

            <button id="ui-input-send-button" class="w3-button w3-round w3-xlarge" style="display: none">Вычислить</button>
        </div>
    </div>

    <div id="data-out" style="display: none">
        <div id="data-out-buttons" style="display: inline-block">
            <button id="data-out-buttons-overview" style="margin: 10px" class="w3-button w3-round w3-large">Обзор</button>
            <button id="data-out-buttons-linear" style="margin: 10px" class="w3-button w3-round w3-large">Линейная аппр.</button>
            <button id="data-out-buttons-square" style="margin: 10px" class="w3-button w3-round w3-large">Квадратичная аппр.</button>
            <button id="data-out-buttons-power" style="margin: 10px" class="w3-button w3-round w3-large">Степенная аппр.</button>
            <button id="data-out-buttons-exponential" style="margin: 10px" class="w3-button w3-round w3-large">Экспоненциальная аппр.</button>
            <button id="data-out-buttons-logarithmically" style="margin: 10px" class="w3-button w3-round w3-large">Логарифимическая аппр.</button>
        </div>
        <table id="data-table">

        </table>
    </div>

    <div id="reset-button">
        <p><button id="reset" class="w3-button w3-round w3-xxlarge" onclick= location.reload()>Сброс</button></p>
    </div>

</div>

<div id="calculator" style="width: 50%; height: 700px;" class="w3-half w3-left"></div>
<div id="table" style=" margin-bottom: 105px" class="w3-table">

</div>
<%--<div>--%>
<%--  <p>--%>
<%--    When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\) and they are--%>
<%--    \[\frac{\frac{1}{x}+\frac{1}{y}}{y-z}\]--%>
<%--  </p>--%>

<%--</div>--%>

<footer class="w3-bottom w3-center w3-teal">
    <p>
        All rights not reserved
    </p>
    <%
        SimpleDateFormat formatter = new SimpleDateFormat("dd MMMM yyyy");
        out.println(formatter.format(Calendar.getInstance().getTime()));
    %>
</footer>

</body>
<script src="JS/lib/jquery-3.6.3.min.js"></script>
<script src="JS/main.js" ></script>
</html>