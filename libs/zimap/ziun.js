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
	var mas = data.split('\n');
	var rn = mas.length;
	if(rn <= 0)
		return;
	var hed = mas[0].split(';');
	var cn = hed.length;
	var ser = [];
	for(var i = 1; i< rn; i++){
		var tmp = new Object();
		var row = mas[i].split(';');
		tmp.name = row[0];
		tmp.data = new Array();
		for(var j=1;j<cn;j++){
			tmp.data[j-1]=parseFloat(row[j].replace(',','.'));
		}
		ser[i-1] = tmp;
	}
	var tmp = new Highcharts.Chart({
        chart: {
	    renderTo: divn,
            type: 'line'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: hed.slice(1,cn)//['Apples', 'Bananas', 'Oranges']
        },
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
  cont.innerHTML = title;//'Здесь будет карта! Честно-честно!';
//по регионам узнаём коды (пока необязательно)

//по кодам узнаём карту (желательно)

//вставляем карту. видимо таки аякс
  var mapadr = '/libs/zimap/maps/russia3.svg';
  var colors = ['#330099','#0000ff','#6666ff','#ccccff'];
  var j = 1;//столбец с данными
  $.ajax({
	url: mapadr,
	dataType:'xml',
	success: function(svgf){
		svgf.viewBow = "0 0 200 200";

		zimap_draw(data,svgf,colors,j);

		cont.innerHTML += svgf.xml ? svgf.xml : (new XMLSerializer()).serializeToString(svgf);
		svgf.setAttribute('viewBox',"0 0 1200 610");
  }});
}

function zimap_draw(data,svgd,colors,j){
//Вычисляем шкалу для цветов
  var mas = data.split('\n');
  var rn = mas.length;
  if(rn <= 0)
    return;
  var min = 0;
  var max = 0;

  for(var i = 1; i< rn; i++){
	var row = mas[i].split(';');
	var reg = row[0];
	var c = row[j];
	if(c == '')
		continue;
	var el = svgd.getElementById(reg);
	if(el == undefined)
		continue;
	var cur = parseFloat(c);
	if(i == 1){
		max = min = cur;
	}else if(cur > max){
		max = cur;
	}else if(cur < min){
		min = cur;
	}
  }

  var cn = colors.length;
  var step = (max-min)/cn;
  var scl = new Array();
  scl[0] = parseFloat(min);
  for(var i=1; i<=cn; i++){
	scl[i]=scl[i-1]+step;
  }
  scl[cn] = max;

//Рисуем легенду
  var i = 0;
  var cury = 200;
  for(i = 0; i < 4; i++){
    var rec = svgd.getElementById('leg'+i);
    rec.setAttribute('x','1100');
    rec.setAttribute('y',cury);
    rec.setAttribute('width','60');
    rec.setAttribute('height','75');
    rec.setAttribute('fill',colors[i]);

    var txt = svgd.getElementById('tcol'+i);
    txt.setAttribute('x','1165');
    txt.setAttribute('y',cury);
    txt.textContent = ziformat(scl[4-i]);
    cury+=75;
  }
  var txt = svgd.getElementById('tcol'+i);
  txt.setAttribute('x','1165');
  txt.setAttribute('y',cury);
  txt.textContent = ziformat(scl[4-i]);
  cury+=75;

//Чистим старые данные и цвета регионов
  var regs = svgd.getElementsByClassName('region');
  for(var i =0;i<regs.length;i++){
	var el = regs[i];
	el.setAttribute('fill','#808080');
	var tit = el.childNodes[1];
	tit.textContent = tit.textContent.split(':')[0];
  }


//бежим по данным, вычисляем цвета и раскрашиваем
  for(var i = 1; i< rn; i++){
	var tmr = mas[i].split(';');
	var reg = tmr[0];
	var c = tmr[j];
	if(c == '')
		continue;
	var cur = parseFloat(c);
	var el = svgd.getElementById(reg);

	if(el != null){
	  var k = 0;
	  for(k = 0; k<cn;k++){
		if(cur <= scl[k+1])
			break;
	  }
          el.setAttribute('fill',colors[cn-k-1]);
    
	  var tit = el.childNodes[1];
//параллельно - дописываем данные в тайтлы, чтоб всплывали
	  tit.textContent = tit.textContent + ': ' + cur;
	}
  }
}

function ziformat(f){
  return Math.round(f*100)/100;
}