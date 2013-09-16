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
                rowstnum: 1
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
                noDataColor: '#808080'
            },
            map: {
                isos: "",
                isolib: [],
                parsed: "",
                notParsed: "",
                svgd: null
            }
        },
        _create: function() {
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
            function() {
                var spn = $("<span></span>").appendTo(self.element);
                $("<div></div>")
                        .slider({
                    min: 1,
                    max: table[0].length - 1
                }).on("slide", function(event, ui) {
                    var cur = ui ? ui.value : 1;
                    spn.html(table[0][cur]);
                    zimap.setColumn(cur);
                }).appendTo(self.element)
                        .trigger("slide");
            });
        },
        _drawChart: function() {
            var table = this.options.data.table;
            var series = new Array(table.length - 1);

            if (this.options.settings.chartType == "pie") {
                this.element.attr("align", "center");
                var d = document.createElement("div");
                $(d).appendTo(this.element);
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: d,
                        type: "pie"
                    },
                    series: [{}]
                });
                var spn = $("<span></span>").appendTo(this.element);
                $("<div></div>")
                        .slider({
                    min: 1,
                    max: table[0].length - 1
                }).on("slide", function(event, ui) {
                    var cur = ui ? ui.value : 1;
                    spn.html(table[0][cur]);
                    var dt = new Array(table.length - 1);
                    for (var i = 1; i < table.length; i++) {
                        dt[i - 1] = [table[i][0], parseFloat(table[i][cur])];
                    }
                    chart.series[0].setData(dt);
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
                    if (table[i][j] == undefined || table[i][j] == null || table[i][j] == '') {
                        continue;
                    }
                    series[i - 1].data[jj] = new Array();
                    series[i - 1].data[jj][0] = parseFloat(table[0][j]);
                    series[i - 1].data[jj++][1] = parseFloat(table[i][j]);
                }
            }
            this.element.highcharts({
                chart: {
                    type: this.options.settings.chartType
                },
                yAxis: {
                    title: {
                        text: table[0][0]
                    }
                },
                xAxis: {
                    categories: table[0].slice(1, table[0].length)
                },
                series: series
                        //,colors:colors
            });
        },
        _prepareData: function() {
            var mas = this.options.data.str.split(this.options.data.rowsep);
            var tab = this.options.data.table;
            for (var i = 0; i < mas.length; i++) {
                var row = mas[i].split(this.options.data.colsep);
                this.options.data.table[i] = row;
                for (var j = 1; j < tab[i].length && i != 0; j++) {
                    var tmp = parseFloat(tab[i][j].replace(',','.'));
                    if(!isNaN(tmp))
                        tab[i][j]=tmp;
                }
            }
        },
        _drawTable: function() {
            this.element.html();
            var table = this.options.data.table;
            var tab = document.createElement('table');
            tab.border = '1';
            var tbh = document.createElement('tr');
            for (var i = 0; i < table[0].length; i++) {
                var th = document.createElement("th");
                th.innerHTML = table[0][i];
                tbh.appendChild(th);
            }
            tab.appendChild(tbh);
            for (var i = 1; i < table.length; i++) {
                var tr = document.createElement('tr');
                for (var j = 0; j < table[i].length; j++) {
                    var td = document.createElement('td');
                    td.innerHTML = table[i][j];
                    tr.appendChild(td);
                }
                tab.appendChild(tr);
            }
            this.element.append(tab);
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
})(jQuery)
