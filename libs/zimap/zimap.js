/* zimm.js - javascript library for coloring
svg document with data provided in csv format.
2013-06-19

Copyright (c) 2013 Ivan Zaytsev (zaycev.ivan@gmail.com)

This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. 
To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter 
to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
*/
var zim_parsed;
var zim_not_parsed;

function splitRows(str){
    var ret = str.split("\r\n");
    if(ret.length == 1){
        ret = str.split("\n");
    }
    return ret;
}

function getXmlHttp(){
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

function Zimap(elt, opts){
    var options = {
        data : {
            str : "",
            colsep : ";",
            rowsep : "\n",
            table : [],
            colnum : 1,
            rowstnum : 1
        },
        settings : {
            type : "Block",//"Category","Gradient"
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
    }
    var min = 0;
    var max = 0;
    var element = elt;
    element.style.opacity = "0.5";
    for(var i in opts.data)
        if(opts.data[i]!=null)
            options.data[i] = opts.data[i];
    for(var i in opts.settings)
        if(opts.settings[i]!=null)
            options.settings[i] = opts.settings[i];
    
    //make ISO library    
    var readISO = function(){
        var isos = options.map.isos;
        var rs = splitRows(isos);
        for(var i in rs){
            options.map.isolib[i] = rs[i].split(';');
        }
    };
    
    var findISO = function(reg) {
        reg = reg.toUpperCase();
        var ilib = options.map.isolib;
        for(var i in ilib){
            var r = ilib[i];
            for(var j in r){
                if(j==0){ 
                    if(reg==r[j]){
                        options.map.parsed+=reg+';'+r[0]+'\r\n';
                        return reg;
                    }
                }else{
                    if(reg.search(new RegExp(r[j],'i'))>=0){
                        options.map.parsed+=reg+';'+r[0]+'\r\n';
                        return r[0];
                    }
                }
            }
        }
        options.map.notParsed+=reg+'\r\n';
        return reg;
    }
    
    //parse region names
    var parseData = function(){
        var mas = options.data.str.split(options.data.rowsep);
        var k = 0;
        for(var i = options.data.rowstnum; i < mas.length; i++){
            var row = mas[i].split(options.data.colsep);
            var reg = row[0];
            reg = findISO(reg);
            options.data.table[k] = row;
            options.data.table[k++][0] = reg;
        }
    };
    
    var calcScales = function(){
        //Вычисляем шкалу для цветов
        var first = true;
        var tab = options.data.table;
        var j = options.data.colnum;
        var svgd = options.map.svgd;
        for(var i = 0; i < tab.length ; i++){
            var c = tab[i][j];
            if(c == ''||tab[i][0]=='')
                continue;
            var el = svgd.getElementById(tab[i][0]);
            if(el == undefined || el == null)
                continue;
            var cur = parseFloat(c.replace(',','.'));
            if(cur == NaN)
                continue;
            if(first){
                max = min = cur;
                first = false;
            }else if(cur > max){
                max = cur;
            }else if(cur < min){
                min = cur;
            }
        }

        var cn = options.settings.colors.length;
        if(options.settings.type=='Gradient')
            cn = 4;
        var step = (max-min)/cn;
        var scl = new Array();
        scl[0] = parseFloat(min);
        for(var i=1; i<cn; i++){
            scl[i]=scl[i-1]+step;
        }
        scl[cn] = max;
        options.settings.scales = scl;
    }
    
    var drawLegend = function(){
        //Рисуем легенду
        var i = 0;
        var svgd = options.map.svgd;
        var cury = parseInt(svgd.getElementById('leg0').getAttribute('y'));
        if(cury!=cury)
            cury=100;
        var colors = options.settings.colors;
        var cn = colors.length;
        var scl = options.settings.scales;
        var h = Math.round(75*4 / cn);
        //clear
        for(i = 0; i < 10; i++){
            var rec = svgd.getElementById('leg'+i);
            rec.setAttribute('width','0');
            rec.setAttribute('height','0');
            rec.setAttribute('style','');
            var txt = svgd.getElementById('tcol'+i);
            txt.textContent = '';        
        }
        if(options.settings.showLegend){
            if(options.settings.type=='Gradient'){
                var rec = svgd.getElementById('leg0');
                rec.setAttribute('x','1100');
                rec.setAttribute('y',cury);
                rec.setAttribute('width','30');
                rec.setAttribute('height','300');
                rec.setAttribute('fill','url(#grad1)');
                for(i = 0; i < cn; i++){
                    var rec = svgd.getElementById('leg'+(i+1));
                    rec.setAttribute('x','1100');
                    rec.setAttribute('y',cury);
                    rec.setAttribute('width','30');
                    rec.setAttribute('height',h);
                    rec.setAttribute('style',"fill:none;stroke:black;");

                    var txt = svgd.getElementById('tcol'+i);
                    txt.setAttribute('x','1135');
                    txt.setAttribute('y',cury+5);
                    txt.textContent = ziformat(scl[cn-i]);
                    cury+=h;
                }
                var txt = svgd.getElementById('tcol'+i);
                txt.setAttribute('x','1135');
                txt.setAttribute('y',cury+5);
                txt.textContent = ziformat(scl[cn-i]);
                cury+=75;
            }else if(options.settings.type=='Block'){
                for(i = 0; i < cn; i++){
                    var rec = svgd.getElementById('leg'+i);
                    rec.setAttribute('x','1100');
                    rec.setAttribute('y',cury);
                    rec.setAttribute('width','30');
                    rec.setAttribute('height',h);
                    rec.setAttribute('fill',colors[cn-i-1]);

                    var txt = svgd.getElementById('tcol'+i);
                    txt.setAttribute('x','1135');
                    txt.setAttribute('y',cury+5);
                    txt.textContent = ziformat(scl[cn-i]);
                    cury+=h;
                }
                var txt = svgd.getElementById('tcol'+i);
                txt.setAttribute('x','1135');
                txt.setAttribute('y',cury+5);
                txt.textContent = ziformat(scl[cn-i]);
                cury+=75;
            }else if(options.settings.type=='Category'){
                if(h>=45)
                    h=45;
                for(i = 0; i < cn; i++){
                    var rec = svgd.getElementById('leg'+i);
                    rec.setAttribute('x','1100');
                    rec.setAttribute('y',cury);
                    rec.setAttribute('width','30');
                    rec.setAttribute('height',h);
                    rec.setAttribute('fill',colors[cn-i-1]);

                    var txt = svgd.getElementById('tcol'+i);
                    txt.setAttribute('x','1135');
                    txt.setAttribute('y',cury+5+h/2);
                    txt.textContent = scl[cn-i-1];
                    cury+=h;
                }
            }
        }
    }
    
    var colorMap = function(){
        //Чистим старые данные и цвета регионов
        var ndc = options.settings.noDataColor;
        var svgd = options.map.svgd;
        var regs = svgd.getElementsByClassName('region');
        for(var i =0;i<regs.length;i++){
            var el = regs[i];
            el.setAttribute('fill',ndc);
            var tit = el.getElementsByTagName('title')[0];
            if(tit==undefined||tit==null){
                var tit = el.getElementsByTagName('tutle')[0];
                if(tit==undefined||tit==null)
                    continue;
            }
            tit.textContent = tit.textContent.split(':')[0];
        }

        //бежим по данным, вычисляем цвета и раскрашиваем
        var colors = options.settings.colors;
        var cn = colors.length;
        var scl = options.settings.scales;
        var tab = options.data.table;
        var j = options.data.colnum;
        for(var i = 0; i< tab.length; i++){
            var reg = tab[i][0];
            var c = tab[i][j];
            if(c == ''||reg=='')
                continue;
            var cur = parseFloat(c.replace(',','.'));
            if(opts.coltype=='Category'){
                cur = c;
            //alert(c);
            }else if(isNaN(cur))
                continue;
            var el = svgd.getElementById(reg);

            if(el != null){
                if(options.settings.type=='Gradient'){
                    var pr = (cur-min)/(max-min);
                    var strcol;
                    if(pr<=0.5){
                        var col = Math.round(2*pr*255);
                        var s1 = col.toString(16);
                        if(s1.length == 1)
                            s1='0'+s1;
                        strcol='#ff'+s1+'00';
                    }else if(pr>=0.5){
                        var col = Math.round(2*(1-pr)*255);
                        var s1 = col.toString(16);
                        if(s1.length == 1)
                            s1='0'+s1;
                        strcol='#'+s1+'ff00';
                    }else
                        strcol='#ffff00';
                    //alert(strcol);
                    el.setAttribute('fill',strcol);
                }else if(opts.coltype=='Category'){
                    var k = 0;
                    for(k = 0; k<cn;k++){
                        //alert(""+cur+" - "+scl[k]);
                        if(cur == scl[k])
                            break;
                    }
                    el.setAttribute('fill',colors[k]);
                }else{
                    var k = 0;
                    for(k = 0; k<cn;k++){
                        if(cur <= scl[k+1])
                            break;
                    }
                    el.setAttribute('fill',colors[k]);
                }
                //var tit = el.childNodes[0];
                //if(tit.textContent == '\n')
                var tit = el.getElementsByTagName('title')[0];//childNodes[0];
                if(tit==undefined||tit==null){
                    var tit = el.getElementsByTagName('tutle')[0];
                    if(tit==undefined||tit==null)
                        continue;
                }
                //параллельно - дописываем данные в тайтлы, чтоб всплывали
                if(options.settings.type=='Category'){
                    tit.textContent = tit.textContent + ': ' + cur;
                }else{
                    tit.textContent = tit.textContent + ': ' + zim_format(""+cur);
                }
            }
        }
    }
    
    var drawMap = function(){
        options.map.svgd = options.map.mapObject.contentDocument;
        if(options.settings.scales == null)
            calcScales();
        drawLegend();
        colorMap();
        element.style.opacity = "1";
    }
    
    var readMap = function(){
        
        //element.innerHTML = "here will be map";
        var adr = '/libs/zimap/maps/'+options.settings.map;
        var svg = adr + '.svg';
        var csv = adr + '.csv';
        
        //get iso codes
        var xmlhttp = getXmlHttp();
        xmlhttp.open('GET', csv, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4)
                if(xmlhttp.status == 200){
                    options.map.isos = xmlhttp.responseText;
                    readISO();
                    parseData();
                    //set map
                    var mapObject = document.createElement('object');
                    //alert(element.tagName);
                    if(element.tagName != "OBJECT"){
                        mapObject.data = svg;
                        element.appendChild(mapObject);
                    }else{
                        var ma = element.attributes;
                        for(var i in ma)
                            mapObject.setAttribute(ma[i].name,ma[i].value);
                        mapObject.data = svg;
                        element.parentNode.insertBefore(mapObject, element);
                        element.parentNode.removeChild(element);
                        element = mapObject;
                    }
                    mapObject.addEventListener("load", drawMap, false);
                    options.map.mapObject = mapObject;
                //alert("here");
                }
        };
        xmlhttp.send(null);
    }
    readMap();
}

function ziformat(f){
    return zim_format(""+Math.round(f*100)/100);
}

function zim_format(f){
    var k = f.indexOf('.')-1;
    if(k<0)
        k = f.length-1;
    var lim = 0;
    if(f.charAt(0)=='-')
        lim++;
    var b = 1;
    for(;k>lim;k--){
        if(b++==3){
            b=1;
            f = f.slice(0,k)+' ' + f.slice(k,f.length);
        }
    }
    return f;
}