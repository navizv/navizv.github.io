﻿$(function(){
            init();
        }
    );

function init() {
    $("circle").click(function () {
        select_station($(this).attr("id"));
    });
    $("text").click(function () {
        select_station($(this).attr("data-name"))
    });
    $("#reset").click(function () {
        reset_selection();
    });
}

function select_station(id) {
    var station = get_station(id);
    var fld, field;
    if ($("#from").attr("data-id") == id)
        return;
    $("#METROMAP text").css({ "text-decoration": "none" });
    if ($("#from").html() == "") {
        fld = $("#from");
        $("#METROMAP [data-name=\"" + id + "\"]").css({ "text-decoration": "underline" });
        field = "fromField";
        if ($("#to").attr("data-id") != "") {
            $("#METROMAP [data-name=\"" + $("#to").attr("data-id") + "\"]").css({ "text-decoration": "underline" });
            find_way(id, $("#to").attr("data-id"));
        }
    } else {
        fld = $("#to");
        if ($("#from").attr("data-id") == id)
            return;
        $("#METROMAP [data-name=\"" + $("#from").attr("data-id") + "\"]").css({ "text-decoration": "underline" });
        $("#METROMAP [data-name=\"" + id + "\"]").css({ "text-decoration": "underline" });
        find_way($("#from").attr("data-id"), id);
        field = "toField";
    }
    fld.html(station.name).css({ "color": station.color }).attr("data-id", id);
    /*if (API.setMyText !== undefined)
        $("#TIME_TEXT").html("~koko").css({ "visibility": "visible", "opacity": "1" });
    else
        $("#TIME_TEXT").html("~kuku").css({ "visibility": "visible", "opacity": "1" });*/
    //API.setMyText(field, station.name, station.color);
}

function select_station_field(fld,id) {
    var station = get_station(id);
    if (fld == "from") {
        var fld1 = $("#from");
        var fld2 = $("#to");
        var field = "fromField";
    } else {
        fld2 = $("#from");
        fld1 = $("#to");
        field = "toField";
    }
    if (fld2.attr("data-id") == id)
        return;

    if (fld1.attr("data-id") == id)
        return;
    else
        $("#METROMAP [data-name=\"" + fld1.attr("data-id") + "\"]").css({ "text-decoration": "none" });
    $("#METROMAP [data-name=\"" + id + "\"]").css({ "text-decoration": "underline" });
    fld1.html(station.name).css({ "color": station.color }).attr("data-id", id);
    //$("#TIME_TEXT").html("~"+fld2.attr("data-id")).css({ "visibility": "visible", "opacity": "1" });
    if(fld2.attr("data-id") != "")
        find_way($("#from").attr("data-id"), $("#to").attr("data-id"));
    //API.setMyText(field, station.name, station.color);
}

function get_station(id) {
    if (id == "PLGM")
        return { color: "green", name: "пл. Гарина-Михайловского" };
    else {
        var name = $("[data-name=\"" + id + "\"]");
        var color = "green";
        if (name.parent().attr("id") == "LENIN_LINE")
            color = "red";
        return { color: color, name: name.html() };
    }
}

var l = [["ZAEL", "GAGA", "KRPR", "PLEN", "OKTB", "RECH", "STUD", "MARX"],
 ["PLGM", "SIBI", "POKR", "BERR", "ZOLN"]];
var per = ["KRPR", "SIBI"];
var time = 0
function find_way(s1, s2) {
    $("#METROMAP line,circle,text").css({ "opacity": "0.1" });
    time = 2;//время ожидания
    var n1 = l[0].indexOf(s1);
    var n2 = l[0].indexOf(s2);
    if (n1 < 0 && n2 < 0) {
        select_way(1, l[1].indexOf(s1), l[1].indexOf(s2));
    } else if (n1 >= 0 && n2 >= 0) {
        select_way(0, n1, n2);
    } else if (n1 >= 0 && n2 < 0) {
        select_way(0, n1, l[0].indexOf(per[0]));
        time += 3;
        select_way(1, l[1].indexOf(s2), l[1].indexOf(per[1]));
    } else if (n1 < 0 && n2 >= 0) {
        select_way(0, n2, l[0].indexOf(per[0]));
        time += 2;
        select_way(1, l[1].indexOf(s1), l[1].indexOf(per[1]));
    }
    var txt = "~" + time + " мин";
    $("#TIME_TEXT").html("~" + time + " мин").css({ "visibility": "visible", "opacity": "1" });
    //setTimeout(function () { API.setMyTime(txt) }, 0);
}

function select_way(line, n1, n2) {
    if (n1 > n2) {
        var t = n1;
        n1 = n2;
        n2 = t;
    }
    while (n1 <= n2) {
        var id = l[line][n1];
        if (n1 != n2) {
            $("#METROMAP #" + id + "_" + l[line][n1 + 1]).css({ "opacity": "1" })
            time += 2;
        }
        $("#METROMAP #" + id).css({ "opacity": "1" })
        $("#METROMAP [data-name=\"" + id + "\"]").css({ "opacity": "1" })
        n1++;
    }
}

function reset_selection() {
    $("#from").html("").attr("data-id", "");
    $("#to").html("").attr("data-id", "").css({"color":"black"});
    $("#METROMAP line,circle,text").css({ "opacity": "1" });
    $("#OB line").css({ "opacity": "0.2" });
    $("#TIME_TEXT").css({ "visibility": "hidden" });
    $("#METROMAP text").css({ "text-decoration": "none" });
}