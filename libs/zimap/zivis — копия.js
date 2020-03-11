/* zivis.js - javascript library for jquery ui widger that provides
 * visualization of data table in different forms (table, some type of chart, map chart).
 * It uses Highcharts by Highsoft (see highcharts.com) for making charts.
 2013-09-16
 
 Copyright (c) 2013 Ivan Zaytsev (zaycev.ivan@gmail.com)
 
 This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. 
 To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter 
 to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 */
(function($) {
    $.widget("zid.zivis", {
        options: {
            data: {
                str: "",
                colsep: ";",
                rowsep: "\n",
                table: [],
                colnum: 1,
                rowstnum: 1,
                title: "Title",
                transpose: false
            },
            settings: {
                vistype: "Table", //"Chart","Map",
                type: "Block", //"Category","Gradient"
                chartType: "line",
                colors: ['#ccccff', '#6666ff', '#0000ff', '#330099'],
                scales: null,
                map: "russia",
                mapFolder: "/libs/zimap/maps",
                showLegend: true,
                noDataColor: '#808080',
				oppositCol : false
            },
            map: {
                isos: "",
                isolib: [],
                parsed: "",
                notParsed: "",
                svgd: null,
				cur: 1
            },
            chart: {}
        },
        getType: function() {
            return this.options.settings.vistype;
        },
        getTable: function() {
            return this.options.data.table;
        },
		getCurCol: function() {
            return this.options.map.cur;
        },
        getSvgd: function() {
            return this.options.map.svgd;
        },
        saveFile: function(s) {
            var vt = this.options.settings.vistype;
            if (vt == "Table") {
                var tab = this.options.data.table;//vr.zivis("getTable");
                var txt = "";
                for (var i in tab) {
                    for (var j in tab[i]) {
                        txt += (tab[i][j] + ";");
                    }
                    txt += "\r\n";
                }
                var blob = new Blob(["\ufeff", txt], {type: "text/csv;charset=utf-8"});
                saveAs(blob, "" + s.name + "." + s.type);//==csv!!
            } else if (vt == "Map") {
                var svgd = this.options.map.svgd;
                if (s.type == "svg") {
                    var blob = new Blob([xml_to_text(svgd).replace(/tutle/g, "title").replace(/ xmlns=\"\"/g, "")], {type: "image/svg+xml;charset=utf-8"});
                    saveAs(blob, "" + s.name + "." + s.type);
                } else {
                    //???
                }
            } else if (vt == "Chart") {
                var type = "";
                if (s.type == "svg") {
                    type = "image/svg+xml";
                } else {
                    type = "image/png";
                }
                this.options.chart.exportChart({
                    filename: translite(s.name),
                    type: type
                });
            }
        },
        _create: function() {
            if (this.options.data.str != "")
                this._prepareData();
            switch (this.options.settings.vistype) {
                case "Table":
                    this._drawTable();
                    break;
                case "Chart":
                    this._drawChart();
                    break;
                case "Map":
                    this._drawMap();
                    break;
            }
        },
        _drawMap: function() {
            this.element.attr("align", "center");
            var table = this.options.data.table;
            var isie = (/msie|trident/i).test(navigator.userAgent);//$.browser.msie;
            var tooltip = $('<div id="tooltip" style="position:absolute;opacity:0.8;border:solid;border-color:black;border-width:2;padding:3 3 3 3;display:none;background-color:white;color:black;"></div>')
                    .appendTo(this.element);
            $("<div></div>").html(this.options.data.title)
                    .css({"text-align": "center"})
                    .addClass("title").appendTo(this.element);
            var d = document.createElement("div");
            $(d).appendTo(this.element);
            if (this.options.settings.scales === null)
                this.options.settings.setScales = true;
            var self = this;
            var zimap = new Zimap(d, {
                data: {
                    table: table.slice(1, table.length)
                },
                settings: this.options.settings
            },
            function(options) {
                var spn = $("<span></span>").appendTo(self.element);
                var max = table[0].length - 1
                var slider = $("<div></div>")
                        .slider({
                    min: 1,
                    max: max,
                    value: max
                }).css("width","95%").draggable().on("slide", function(event, ui) {
                    var cur = ui ? ui.value : max;
                    spn.html(table[0][cur]);
                    zimap.setColumn(cur);
					self.options.map.cur = cur;
                }).appendTo(self.element)
                        .trigger("slide");
                self.options.map = options.map;
                if (options.settings.tutle) {//всплывающие подсказки
                    var show_tooltip = function(tit, evt) {
                        tooltip.html(tit);
                        tooltip.css({
                            left: evt.pageX + (options.settings.tutlex?options.settings.tutlex:5),
                            top: evt.pageY + (options.settings.tutley?options.settings.tutley:35),
                            display: "inline"
                        });
                    }

                    var hide_tooltip = function() {
                        tooltip.css({display: "none"});
                    }
                    slider.mousedown(hide_tooltip);
                    if (isie)
                        $(options.map.svgd).mousedown(hide_tooltip);

                    $(options.map.svgd.getElementsByClassName('region')).mousedown(function(evt) {
                        var tit = this.getElementsByTagName('tutle')[0].textContent;
                        show_tooltip(tit, evt);
                    }).hover(function(evt) {
                        var tit = this.getElementsByTagName('tutle')[0].textContent;
                        show_tooltip(tit, evt);
                    }).mouseout(function() {
                        //alert(isie);
                        if (isie) {
                        } else {
                            hide_tooltip();
                        }
                    });
                }
            });
        },
        _drawChart: function() {
            var table = this.options.data.table;
            var series = new Array(table.length - 1);
            var type = this.options.settings.chartType;
            var title = this.options.data.title;
            if (type == "pie" || type == "column") {
                this.element.attr("align", "center");
                var d = document.createElement("div");
                $(d).appendTo(this.element);
                var obj = {
                    chart: {
                        renderTo: d,
                        type: type
                    },
                    title: {
                        text: title
                    },
                    series: [{}],
                    legend: {
                        enabled: false
                    }
                };
                if (type != "pie") {//column
                    obj.xAxis = {categories: []};
                    for (i = 1; i < table.length; i++)
                        obj.xAxis.categories.push(table[i][0]);
                }
                if (type == "pie") {
                    obj.tooltip = {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>',
                        //shared: true
                    };
                }
                var chart = new Highcharts.Chart(obj);
                this.options.chart = chart;
                var spn = $("<span></span>").appendTo(this.element);
                var max = table[0].length - 1
                $("<div></div>")
                        .slider({
                    min: 1,
                    max: max,
                    value: max
                }).draggable().on("slide", function(event, ui) {
                    var cur = ui ? ui.value : max;
                    spn.html(table[0][cur]);
                    var dt = new Array(table.length - 1);
                    for (var i = 1; i < table.length; i++) {
                        var tmp = parseFloat(table[i][cur]);
                        if (!isNaN(tmp)) {
                            dt[i - 1] = [table[i][0], tmp];
                        } else {
                            dt[i - 1] = [table[i][0], 0];
                        }
                    }
                    chart.series[0].setData(dt);
                    chart.series[0].name = title;
                })
                        .appendTo(this.element)
                        .trigger("slide");

                return;
            }
            for (var i = 1; i < table.length; i++) {
                series[i - 1] = new Object();
                series[i - 1].name = table[i][0];
                series[i - 1].data = new Array(table[i].length - 1)
                var jj = 0;
                for (var j = 1; j < table[i].length; j++) {
                    if (table[i][j] == undefined || table[i][j] == null || table[i][j] === '' || isNaN(table[i][j])) {
                        continue;
                    }
                    series[i - 1].data[jj] = new Array();
                    series[i - 1].data[jj][0] = parseFloat(table[0][j]);
                    series[i - 1].data[jj++][1] = parseFloat(table[i][j]);
                }
            }
            //this.element.highcharts
            var t = type.split("_");
            var obj = {
                chart: {
                    renderTo: this.element.get(0),
                    type: t[0]
                },
                title: {
                    text: title
                },
                yAxis: {
                    title: {
                        text: table[0][0]
                    }
                },
                xAxis: {
                    categories: table[0].slice(1, table[0].length),
                    //tickInterval: 10
                    //tickmarkPlacement: 'on'
                },
                series: series
                        //,colors:colors
            };
            var sr = obj.xAxis.categories;
            sr = sr[sr.length - 1] - sr[0];
            if (sr > 70)
                sr = 10;
            else if (sr > 30)
                sr = 5;
            else
                sr = 1;
            obj.xAxis.tickInterval = sr;
            if (t[0] == "area") {
                obj.plotOptions = {area: {stacking: t[1]}};
            }
            if (t[1] == "percent") {
                obj.tooltip = {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>',
                    //shared: true
                };
            }
            this.options.chart = new Highcharts.Chart(obj);
        },
        _prepareData: function() {
            var mas = this.options.data.str.split(this.options.data.rowsep);
            this.options.data.table = [];
            var tab = this.options.data.table;
            for (var i = 0; i < mas.length; i++) {
                if (mas[i] == '')
                    continue;
                var row = mas[i].split(this.options.data.colsep);
                tab[i] = row;
                for (var j = 1; j < tab[i].length && i != 0; j++) {
                    var tmp = parseFloat(tab[i][j].replace(',', '.'));
                    if (!isNaN(tmp))
                        tab[i][j] = tmp;
                }
            }
            if (this.options.data.transpose) {
                this.options.data.table = new Array(tab[0].length);
                var tab2 = this.options.data.table;
                for (var j = 0; j < tab[0].length; j++) {
                    tab2[j] = new Array(tab.length);
                    for (var i = 0; i < tab.length; i++)
                        tab2[j][i] = tab[i][j];
                }
            }
        },
        _drawTable: function() {
            this.element.html();
            var table = this.options.data.table;
            var tab = document.createElement('table');
            tab.border = '1';
            $("<caption></caption>").html(this.options.data.title)
                    .addClass("title").appendTo(tab);
            //var cap = document.createElement('caption');
            //cap.innerHTML = this.options.data.title;
            //tab.appendChild(cap);
            var tbhd = document.createElement('thead');
            var tbh = document.createElement('tr');
            for (var i = 0; i < table[0].length; i++) {
                var th = document.createElement("th");
                th.innerHTML = table[0][i];
                tbh.appendChild(th);
            }
            tbhd.appendChild(tbh);
            tab.appendChild(tbhd);
            var tbbd = document.createElement('tbody');
            for (var i = 1; i < table.length; i++) {
                var tr = document.createElement('tr');
                for (var j = 0; j < table[i].length; j++) {
                    var td = document.createElement('td');
                    td.innerHTML = (j > 0 & isNaN(table[i][j])) ? "..." : table[i][j];
                    tr.appendChild(td);
                }
                tbbd.appendChild(tr);
            }
            tab.appendChild(tbbd);
            this.element.append(tab);
            $(tab).zitable();
        }
    });

    $.widget("zid.ziselector", {
        _create: function() {
            var elt = this.element;
            var divs = elt.children("div").hide();
            this.element.children("select").change(function() {
                divs.hide();
                elt.children("div#" + this.value).show();
            }).change();
        }
    });

    $.widget("zid.ziradio", {
        _create: function() {
            var elt = this.element;
            var divs = elt.children("div").hide();
            this.element.children('input[type="radio"]').change(function() {
                divs.hide();
                elt.children("div#" + this.id + "Div").show();
            });
            this.element.children('input[type="radio"]:checked').change();
        }
    });

    $.widget("zid.zitable", {
        options: {
            curi: -1,
            desc: -1
        },
        _create: function() {
            this.element.css({
                "table-layout": "fixed"});
            var el = this.element.get(0);
            var ths = el.childNodes[1].childNodes[0].childNodes;
            var trs = el.childNodes[2].childNodes;
            var tds = [];
            var tab = [];
            var curtab = [];
            for (var i = 0; i < trs.length; i++) {
                tds[i] = trs[i].childNodes;
                tab[i] = [];
                for (var j = 0; j < tds[i].length; j++)
                    tab[i][j] = tds[i][j].innerHTML;
                curtab[i] = tab[i];
            }
            var head = [];//new Array(ths.length);
            var curi = this.options.curi;
            var desc = this.options.desc;
            var self = this;
            for (var i = 0; i < ths.length; i++) {
                head[i] = ths[i].innerHTML;
                var th = $(ths[i]);
                th.addClass("zitud").addClass("zit")
                        .css({width: Math.max(th.width(), 100)});
                (function(k) {
                    $(ths[k]).click(function() {
                        if (k == curi) {
                            desc++;
                            if (desc == 2)
                                desc = -1;
                        } else {
                            desc = -1;
                            $(ths[curi]).removeClass("zitup zitdo").
                                    addClass("zitud");
                            curi = k;
                        }
                        $(ths[curi]).removeClass("zitup zitdo zitud").addClass(
                                (desc == -1) ? "zitdo" :
                                (desc == 0) ? "zitup" : "zitud");
                        //alert(curi+"-"+desc);
                        if (desc == -1) {
                            curtab.sort(function(a, b) {
                                var aa = parseFloat(a[k]);
                                var bb = parseFloat(b[k]);
                                if (isNaN(aa) && isNaN(bb)) {
                                    aa = a[k];
                                    bb = b[k];
                                } else if (isNaN(aa) && !isNaN(bb)) {
                                    return 1;
                                } else if (!isNaN(aa) && isNaN(bb)) {
                                    return -1;
                                }
                                if (aa == bb)
                                    return 0;
                                else if (aa > bb)
                                    return -1;
                                else
                                    return 1;
                            });
                        } else if (desc == 0) {
                            curtab.reverse();
                            /*var tmp;
                             var n = curtab.length;
                             for (var l = 0; l < n / 2; l++) {
                             tmp = curtab[l];
                             curtab[l] = curtab[n - l - 1];
                             curtab[n - l - 1] = tmp;
                             }*/
                        } else {
                            var n = curtab.length;
                            for (var l = 0; l < n; l++) {
                                curtab[l] = tab[l];
                            }
                        }
                        self._fill(curtab, tds);
                    });
                })(i);
            }

            //alert(tab.length);

            /*var thd = elt.children("thead");
             
             this.element.children('input[type="radio"]').change(function() {
             divs.hide();
             elt.children("div#" + this.id + "Div").show();
             }).change();*/
        },
        _fill: function(tab, tds) {
            //alert(tab[1][0]);
            for (var i = 0; i < tab.length; i++)
                for (var j = 0; j < tab[i].length; j++)
                    tds[i][j].innerHTML = tab[i][j];
        }
    });
})(jQuery);

function xml_to_text(svgf) {
    return svgf.xml ? svgf.xml : (new XMLSerializer()).serializeToString(svgf);
}

function translite(str) {
    var arr = {'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'g', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'ы': 'i', 'э': 'e', 'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'G', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Ы': 'I', 'Э': 'E', 'ё': 'yo', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ь': '', 'ю': 'yu', 'я': 'ya', 'Ё': 'YO', 'Х': 'H', 'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHCH', 'Ъ': '', 'Ь': '',
        'Ю': 'YU', 'Я': 'YA'};
    var replacer = function(a) {
        return arr[a] || a
    };
    return str.replace(/[А-яёЁ]/g, replacer)
}
