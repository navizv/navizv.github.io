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
	cont.innerHTML = title;//'«десь будет карта! „естно-честно!';
//по регионам узнаЄм коды (пока необ€зательно)

//по кодам узнаЄм карту (желательно)

//вставл€ем карту. видимо таки а€кс
var mapadr = '/zimap/russia.svg';
$.ajax({
url: mapadr,
dataType:'xml',
success: function(svgf){
//cont.innerHTML = svgf;
//cont.innerHTML = '<object data=\"'+mapadr+'\" type="image/svg+xml" id="mymap"></object>';
//вычисл€ем легенду. скопипастить из http_test
var j = 1;//столбец с данными
	var mas = data.split('\n');
	var rn = mas.length;
	if(rn <= 0)
		return;
	var min = 0;
	var max = 0;

	for(var i = 1; i< rn; i++){
		var cur = mas[i].split(';')[j];
		if(i == 1){
			max = min = cur;
		}else if(cur > max){
			max = cur;
		}else if(cur < min){
			min = cur;
		}

	}
var colors = ['#330099','#0000ff','#6666ff','#ccccff'];
var cn = colors.length;
var step = (max-min)/cn;
var scl = new Array();
scl[0] = parseFloat(min);
for(var i=1; i<=cn; i++){
	scl[i]=scl[i-1]+step;
}
svgf.viewBow = "0 0 200 200";
  //var svg = document.getElementById('mymap');
  //var svgd = svg.contentDocument;
//var tem = svgd.getElementById('sa');
//alert(tem);
var svgd = svgf;//document;
  var i = 0;
  var cury = 200;
  for(i = 0; i < 4; i++){
    var rec = svgd.getElementById('leg'+i);
//alert(svgd)
//alert(rec)
    rec.setAttribute('x','1100');
    rec.setAttribute('y',cury);
    rec.setAttribute('width','60');
    rec.setAttribute('height','75');
    rec.setAttribute('fill',colors[i]);

    var txt = svgd.getElementById('tcol'+i);
    txt.setAttribute('x','1165');
    txt.setAttribute('y',cury);
    txt.textContent = scl[4-i];
    cury+=75;
  }
var txt = svgd.getElementById('tcol'+i);
    txt.setAttribute('x','1165');
    txt.setAttribute('y',cury);
    txt.textContent = scl[4-i];
    cury+=75;
//бежим по данным, вычисл€ем цвета и раскрашиваем
for(var i = 1; i< rn; i++){
  var tmr = mas[i].split(';');
  var reg = tmr[0];
  var cur = tmr[j];
    var el = svgd.getElementById(reg);

    if(el != null){
	var k = 0;
	for(k = 0; k<cn;k++){
		if(cur <= scl[k+1]){
			break;}}
      el.setAttribute('fill',colors[cn-k-1]);
    
      var tit = el.childNodes[1];
//параллельно - дописываем данные в тайтлы, чтоб всплывали
      tit.textContent = tit.textContent + ': ' + cur;
    //alert(reg+":"+el.childNodes[1].textContent);
    }
  }

cont.innerHTML += svgf.xml ? svgf.xml : (new
XMLSerializer()).serializeToString(svgf);

//var map = cont.childNodes[1];
//map.setAttribute('width','100%');
//map.setAttribute('height','100%');
svgd.setAttribute('viewBox',"0 0 1200 610");
}});
}