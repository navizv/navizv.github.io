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

function zimap_draw(data,svgd,colors,j,isos){
    var isosp = isos || '';
    zimap_draw_x(data,svgd,colors,j,';',1,false,isosp);
}

function zim_make_ilib(isos){
    zim_parsed = zim_not_parsed = '';
    var rs = isos.split('\r\n');
    if(rs.length==1)
        rs = isos.split('\n');

    var arr = new Array();
    for(var i in rs){
        arr[i] = rs[i].split(';');
    }
    return arr;
}

function zim_find_iso(reg,ilib){
    //alert(reg+';'+ilib.length);
    reg = reg.toUpperCase();
    for(var i in ilib){
        var r = ilib[i];
        for(var j in r){
            if(j==0){ 
                //alert('|'+reg+'|'+r[j]+'|');
                if(reg==r[j]){
                    zim_parsed+=reg+';'+r[0]+'\r\n';
                    //          alert('!'+zim_parsed);
                    return reg;
                }
            }else{
                //if(reg=='RU-BEL')
                //alert('|'+reg+'|'+r[j]+'|');
                if(reg.search(new RegExp(r[j],'i'))>=0){
                    zim_parsed+=reg+';'+r[0]+'\r\n';
                    //alert('!'+zim_parsed);
                    return r[0];
                }
            }
        }
    }
    zim_not_parsed+=reg+'\r\n';
    //alert('?'+zim_not_parsed);
    return reg;
}

function zimap_draw_x(data,svgd,colors,j,colsep,strow,grad,isos){
    //alert(isos);
    //Вычисляем шкалу для цветов
    var mas = data.split('\r\n');
    var rn = mas.length;
    if(rn <= 0)
        return;
    if(rn==1){
        mas = data.split('\n');
        rn = mas.length;
    }
    var min = 0;
    var max = 0;
    var ids = new Array();
    var ilib;
    if(isos != ''){
        ilib = zim_make_ilib(isos);
    }

    var first = true;
    for(var i = strow; i< rn; i++){
        var row = mas[i].split(colsep);
        //alert(mas[i]+colsep+row.length);
        var reg = row[0];
        if(isos!=''){
            reg = zim_find_iso(reg,ilib);
        }
        ids[i]=reg;
        var c = row[j];
        if(c == ''||reg=='')
            continue;
        var el = svgd.getElementById(reg);
        if(el == undefined || el == null)
            continue;
        var cur = parseFloat(c);
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

    var cn = colors.length;
    if(grad)
        cn=4;
    var step = (max-min)/cn;
    var scl = new Array();
    scl[0] = parseFloat(min);
    for(var i=1; i<=cn; i++){
        scl[i]=scl[i-1]+step;
    }
    scl[cn] = max;
    //Рисуем легенду
    var i = 0;
    var cury = parseInt(svgd.getElementById('leg0').getAttribute('y'));
    if(cury!=cury)//awesome chech for NaN. isNaN() doesn't work here
        cury=100;

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
    if(grad){
        var rec = svgd.getElementById('leg0');
        rec.setAttribute('x','1100');
        rec.setAttribute('y',cury);
        rec.setAttribute('width','60');
        rec.setAttribute('height','300');
        rec.setAttribute('fill','url(#grad1)');
        for(i = 0; i < cn; i++){
            var rec = svgd.getElementById('leg'+(i+1));
            rec.setAttribute('x','1100');
            rec.setAttribute('y',cury);
            rec.setAttribute('width','60');
            rec.setAttribute('height',h);
            rec.setAttribute('style',"fill:none;stroke:black;");

            var txt = svgd.getElementById('tcol'+i);
            txt.setAttribute('x','1165');
            txt.setAttribute('y',cury+5);
            txt.textContent = ziformat(scl[cn-i]);
            cury+=h;
        }
        var txt = svgd.getElementById('tcol'+i);
        txt.setAttribute('x','1165');
        txt.setAttribute('y',cury+5);
        txt.textContent = ziformat(scl[cn-i]);
        cury+=75;
    }else{
        for(i = 0; i < cn; i++){
            var rec = svgd.getElementById('leg'+i);
            rec.setAttribute('x','1100');
            rec.setAttribute('y',cury);
            rec.setAttribute('width','60');
            rec.setAttribute('height',h);
            rec.setAttribute('fill',colors[i]);

            var txt = svgd.getElementById('tcol'+i);
            txt.setAttribute('x','1165');
            txt.setAttribute('y',cury+5);
            txt.textContent = ziformat(scl[cn-i]);
            cury+=h;
        }
        var txt = svgd.getElementById('tcol'+i);
        txt.setAttribute('x','1165');
        txt.setAttribute('y',cury+5);
        txt.textContent = ziformat(scl[cn-i]);
        cury+=75;
    }
    //Чистим старые данные и цвета регионов
    var regs = svgd.getElementsByClassName('region');
    for(var i =0;i<regs.length;i++){
        var el = regs[i];
        el.setAttribute('fill','#808080');
        var tit = el.getElementsByTagName('title')[0];
        if(tit==undefined||tit==null){
            var tit = el.getElementsByTagName('tutle')[0];
            if(tit==undefined||tit==null)
                continue;
        }
        tit.textContent = tit.textContent.split(':')[0];
    }

    //бежим по данным, вычисляем цвета и раскрашиваем
    for(var i = strow; i< rn; i++){
        var tmr = mas[i].split(colsep);
        var reg = ids[i];//tmr[0];
        var c = tmr[j];
        if(c == ''||reg=='')
            continue;
        var cur = parseFloat(c);
        if(isNaN(cur))
            continue;
        var el = svgd.getElementById(reg);

        if(el != null){
            if(grad){
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
            }else{
                var k = 0;
                for(k = 0; k<cn;k++){
                    if(cur <= scl[k+1])
                        break;
                }
                el.setAttribute('fill',colors[cn-k-1]);
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
            tit.textContent = tit.textContent + ': ' + cur;
        }
    }
}

function ziformat(f){
    return Math.round(f*100)/100;
}


function xml_to_text(svgf){
  return svgf.xml ? svgf.xml : (new XMLSerializer()).serializeToString(svgf);
}