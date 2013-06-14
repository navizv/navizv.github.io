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
  var mapadr = '/libs/zimap/maps/russia4.svg';
  var colors = ['#330099','#0000ff','#6666ff','#ccccff'];
  var j = 1;//столбец с данными
  $.ajax({
	url: mapadr,
	dataType:'xml',
	success: function(svgf){
		svgf.viewBow = "0 0 200 200";

		zimap_draw(data,svgf,colors,j);

		cont.innerHTML += xml_to_text(svgf);
		//svgf.setAttribute('viewBox',"0 0 1200 610");
  }});
}

function xml_to_text(svgf){
  return svgf.xml ? svgf.xml : (new XMLSerializer()).serializeToString(svgf);
}