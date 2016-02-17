$(function(){
            init();
        }
    );

function init() {
    $("text").each(function () {
        if ($(this).attr("x") == undefined) {
            var circle = $("#" + $(this).attr("data-name"));
            $(this).attr("x", 8 + parseInt(circle.attr("cx"))).attr("y", 5 + parseInt(circle.attr("cy")));
        }
    });

    $("line").each(function () {
        if ($(this).attr("x1") == undefined) {
            var txt = $(this).attr("id").split("_");
            var circle1 = $("#" + txt[0]);
            var circle2 = $("#" + txt[1]);
            $(this).attr("x1", circle1.attr("cx")).attr("y1", circle1.attr("cy"))
                .attr("x2", circle2.attr("cx")).attr("y2", circle2.attr("cy"));
        }
    });

    $("circle").click(function () {
        select_station($(this).attr("id"));
    });
    $("text").click(function () {
        select_station($(this).attr("data-name"))
    });
    $("#reset").click(function () {
        reset_selection();
    });

    (function (data) {
        //alert("qq");
        var strs = data.split(":");
        var i, j;
        i = j = -1;
        l = [];
        ln = [];
        lt = [];
        per = [];
        pert = [];
        var is = false;
        for (var s in strs) {
            var line;
            var std = strs[s].split(";");
            if (std[0] == "line") {
                line = std[1];
                i++;
                l.push([]);
                lt.push([]);
                ln.push([]);
            } else if (std[0] == "intersect") {
                is = true;
            } else if (is) {
                per.push([std[0], std[1]]);
                pert.push(std[2] == "" ? 3 : std[2]);
            } else {
                //var station = { id: std[0], name: std[1], line: line };
                l[i].push(std[0]);//station);
                ln[i].push(std[1]);
                lt[i].push(std[2] == "" ? 3 : std[2]);
                j++;
            }
        }
        //alert(pert);
    })(csvdata);
    
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

function select_station_field(fld, id) {
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
    if (fld2.attr("data-id") != "")
        find_way($("#from").attr("data-id"), $("#to").attr("data-id"));
    //API.setMyText(field, station.name, station.color);
}

function get_station(id) {
    for (var i in l) {
        var pos = l[i].indexOf(id);
        if (pos >= 0) {
            var n = ln[i][pos];
            break;
        }
    }
    if (id == "PLGM")
        return { color: "green", name: "пл. Гарина-Михайловского" };
    else {
        var name = $("[data-name=\"" + id + "\"]");
        var color = name.css("fill");//"green";
        //if (name.parent().attr("id") == "LENIN_LINE")
            //color = "red";
        return {
            color: color, name: n != "" ? n : name.html()
        };
    }
}

function get_station_nums(id) {
    for (var i in l) {
        var pos = l[i].indexOf(id);
        if (pos >= 0) {
            return { line: i, station: pos };
        }
    }
}


var l,lt,ln;// = [["ZAEL", "GAGA", "KRPR", "PLEN", "OKTB", "RECH", "STUD", "MARX"],
 //["PLGM", "SIBI", "POKR", "BERR", "ZOLN"]];
var per,pert;// = ["KRPR", "SIBI"];
var time = 0;

function find_best_way(way, sc, s2, best) {
    var cs2;
    if (best != null) {
        if (way.time >= best.time)
            return best;
    }
    if(sc == s2){
        best = {
            time: way.time,
            way: way.way.slice()
        };
        return best;
    }
    
    if(way.dir == -1 || way.dir == 0  || way.dir == 2) {
        if (way.cs > 0) {
            sc2 = l[way.cl][way.cs - 1];
            way.way.push(sc2);
            best = find_best_way({ time: way.time + lt[way.cl][way.cs - 1], way: way.way, dir: -1, cl: way.cl, cs: way.cs - 1 }, sc2, s2, best);
            way.way.pop();
        }
    }

    if (way.dir == 1 || way.dir == 0 || way.dir == 2) {
        if (way.cs < l[way.cl].length) {
            sc2 = l[way.cl][way.cs + 1];
            way.way.push(sc2);
            best = find_best_way({ time: way.time + lt[way.cl][way.cs], way: way.way, dir: 1, cl: way.cl, cs: way.cs + 1 }, sc2, s2, best);
            way.way.pop();
        }
    }

    if (way.dir == 1 || way.dir == 0 || way.dir == -1) {
        for (var p in per) {
            var i = per[p].indexOf(sc);
            if (i >= 0 && way.way.indexOf(per[p][1 - i]) < 0) {
                var csns = get_station_nums(per[p][1 - i]);
                sc2 = l[csns.line][csns.station];
                way.way.push(sc2);
                best = find_best_way({ time: way.time + pert[p] + 3, way: way.way, dir: 2, cl: csns.line, cs: csns.station }, sc2, s2, best);
                way.way.pop();
            }
        }
    }

    return best;
}

function find_way(s1, s2) {
    //alert(">" + s1 + "-" + s2);
    $("#METROMAP line,circle,text,path").css({ "opacity": "0.1" });
    time = 2;//время ожидания

    var csns = get_station_nums(s1);
    var way = find_best_way({ time: time, way: [s1], cl: csns.line, cs: csns.station, dir: 0 },s1,s2, null);
    select_way(way.way);

    var txt = "~" + way.time + " мин";
    $("#TIME_TEXT").html("~" + way.time + " мин").css({ "visibility": "visible", "opacity": "1" });
    //API.setMyTime(txt);
}

function select_way(way) {
    var n1 = 0, n2 = way.length - 1;
    while (n1 <= n2) {
        var id = way[n1];
        if (n1 != n2) {
            $("#METROMAP #" + id + "_" + way[n1 + 1]).css({ "opacity": "1" })
            $("#METROMAP #" + way[n1 + 1] + "_" + id).css({ "opacity": "1" })
        }
        $("#METROMAP #" + id).css({ "opacity": "1" })
        
        if(n1 >= 1)
        $("#METROMAP [data-name=\"" + id + "\"]").css({ "opacity": "1" })
        n1++;
    }
    //$("#TIME_TEXT").html("~" + way[0] + " мин").css({ "visibility": "visible", "opacity": "1" });
    setTimeout(function () { 
        $("#METROMAP [data-name=\"" + way[0] + "\"]").css({ "opacity": "1" })
        //API.setMyTime(txt)
    }, 0);
}

function reset_selection() {
    $("#from").html("").attr("data-id", "");
    $("#to").html("").attr("data-id", "").css({"color":"black"});
    $("#METROMAP line,circle,text,path").css({ "opacity": "1" });
    $("#OB line").css({ "opacity": "0.2" });
    $("#TIME_TEXT").css({ "visibility": "hidden" });
    $("#METROMAP text").css({ "text-decoration": "none" });
}