
(function($){
    $.widget("zid.zivis", {
        options : {
            data : {
                str : "",
                colsep : ";",
                rowsep : "\n",
                table : [],
                colnum : 1,
                rowstnum : 1
            },
            settings : {
                vistype : "Table",//"Chart","Map",
                type : "Block",//"Category","Gradient"
                chartType : "line",
                colors : ['#ccccff','#6666ff','#0000ff','#330099'],
                scales : null,
                map : "russia",
                mapFolder : "/libs/zimap/maps",
                showLegend : true,
                noDataColor : '#808080'
            },
            map : {
                isos : "",
                isolib : [],
                parsed : "",
                notParsed : "",
                svgd : null
            }
        },
        _create : function(){
            this._prepareData();
            switch(this.options.settings.vistype){
                case "Table":
                    this._drawTable();
                    break;
                case "Chart":
                    this._drawChart();
                    break;
                case "Map":
                    this._drawMap();
            }
        },
        _drawChart : function(){
            var table = this.options.data.table;
            var series = new Array(table.length - 1);
            
            if(this.options.settings.chartType == "pie"){
                this.element.attr("align","center");
                var d = document.createElement("div");
                $(d).appendTo(this.element);
                var chart = new Highcharts.Chart({
                    chart :{
                        renderTo : d,
                        type : "pie"
                    },
                    series : [{}]
                });
                var spn = $("<span></span>").appendTo(this.element);
                $("<div></div>")
                .slider({
                    min : 1,
                    max : table[0].length - 1
                }).on("slide",function(event, ui){
                    var cur = ui ? ui.value : 1;
                    spn.html(table[0][cur]);
                    var dt = new Array(table.length - 1);
                    for(var i=1;i<table.length;i++){
                        dt[i-1]=[table[i][0],parseFloat(table[i][cur])];
                    }
                    chart.series[0].setData(dt);
                })
                .appendTo(this.element)
                .trigger("slide");
                
                return;
            }
            for(var i = 1; i < table.length; i++){
                series[i-1] = new Object();
                series[i-1].name = table[i][0];
                series[i-1].data = new Array(table[i].length - 1)
                var jj = 0;
                for(var j = 1; j < table[i].length; j++){
                    if(table[i][j]==undefined || table[i][j]==null || table[i][j]==''){
                        continue;
                    }
                    series[i-1].data[jj] = new Array();
                    series[i-1].data[jj][0] = parseFloat(table[0][j]);
                    series[i-1].data[jj++][1] = parseFloat(table[i][j]);
                }
            }
            this.element.highcharts({
                chart : {
                    type : this.options.settings.chartType
                },
                yAxis : {
                    title : {
                        text : table[0][0]
                    }
                },
                xAxis : {
                    categories : table[0].slice(1, table[0].length)
                },
                series : series
            //,colors:colors
            });
        },
        _prepareData : function(){
            var mas = this.options.data.str.split(this.options.data.rowsep);
            for(var i = 0; i < mas.length; i++){
                var row = mas[i].split(this.options.data.colsep);
                this.options.data.table[i] = row;
            }
        },
        _drawTable : function(){
            this.element.html();
            var table = this.options.data.table;
            var tab = document.createElement('table');
            tab.border = '1';
            var tbh = document.createElement('tr');
            for(var i = 0; i < table[0].length; i++){
                var th = document.createElement("th");
                th.innerHTML = table[0][i];
                tbh.appendChild(th);
            }
            tab.appendChild(tbh);
            for(var i = 1; i < table.length; i++){
                var tr = document.createElement('tr');
                for(var j = 0; j < table[i].length; j++){
                    var td = document.createElement('td');
                    td.innerHTML = table[i][j];
                    tr.appendChild(td);
                }
                tab.appendChild(tr);
            }
            this.element.append(tab);
        }
    });
})(jQuery)


function zitab(title,data,divn){
    var cont = document.getElementById(divn);
    cont.innerHTML = title;

    var tab = document.createElement('table');
    tab.border = '1';
    var tbd = document.createElement('tbody');
    var row = document.createElement('tr');
    var cell = document.createElement('td');


    var mas = data.split('\n');
    var rn = mas.length;
    if(rn <= 0)
        return;
    for(var i = 0; i< rn; i++){
        row = document.createElement('tr');
        var rw = mas[i].split(';');
        for(var j in rw){
            cell = document.createElement('td');
            cell.innerHTML = rw[j];
            row.appendChild(cell);
        }
        tbd.appendChild(row);
    }



    tab.appendChild(tbd);
    cont.appendChild(tab);
}

function zidiag(title,data,divn){
    var mas = data.split('\r\n');
    if(mas.length == 0)
        mas = data.split('\n');
    var rn = mas.length;
    if(rn <= 0)
        return;
    var hed = mas[0].split(';');
    var cn = hed.length;
    var ser = [];
    for(var i = 1; i< rn; i++){
        var tmp = new Object();
        var row = mas[i].split(';');
        if(mas[i] == '' || mas[i] == '\r')
            continue;
        tmp.name = row[0];
        tmp.data = new Array();
        var jj=0;
        for(var j=1;j<cn;j++){
            if(row[j]==undefined || row[j]==null || row[j]==''){
                //alert(row[0]);
                continue;//row[j]='0';
            }
            tmp.data[jj] = new Array();
            tmp.data[jj][0]=parseFloat(hed[j].replace(',','.'));
            tmp.data[jj++][1]=parseFloat(row[j].replace(',','.'));
        }
        ser[i-1] = tmp;
    }
    Highcharts.setOptions({
        lang: {
            thousandsSep : ''
        }
    });
    //	var tmp = new Highcharts.Chart({
    $('#'+divn).highcharts({
        chart: {
            //renderTo: divn,
            type: 'line'
        },
        title: {
            text: title
        },
        //xAxis: {
        //    categories: hed.slice(1,cn)//['Apples', 'Bananas', 'Oranges']
        //},
        yAxis: {
            title: {
                text: hed[0]//'Fruit eaten'
            }
        },
        series: ser
    });

}

function zimap(title,data,divn){
    var cont = document.getElementById(divn);
    cont.innerHTML = title;
    //по регионам узнаём коды (пока необязательно)

    //по кодам узнаём карту (желательно)

    //вставляем карту. видимо таки аякс
    var mapadr = '/libs/zimap/maps/russia.svg';
    var isoadr = '/libs/zimap/maps/russia.csv';
    var colors = ['#330099','#0000ff','#6666ff','#ccccff'];
    var j = 1;//столбец с данными
    zim_make_chart(data,j,mapadr,isoadr,colors,cont);

}

function zim_make_chart(data,j,mapadr,isoadr,colors,cont){
    $.ajax({
        url: mapadr,
        dataType:'xml',
        success: function(svgf){
            svgf.viewBow = "0 0 200 200";
            $.ajax({
                url: isoadr,
                dataType:'html',
                success: function(isos){
                    zimap_draw(data,svgf,colors,j,isos);

                    cont.innerHTML += xml_to_text(svgf);
                //svgf.setAttribute('viewBox',"0 0 1200 610");
                }
            });
        }
    });
}