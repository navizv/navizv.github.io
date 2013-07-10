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

		for(var j=1;j<cn;j++){
if(row[j]==undefined || row[j]==null || row[j]=='')
	continue;//row[j]='0';
tmp.data[j-1] = new Array();
			tmp.data[j-1][0]=parseFloat(hed[j].replace(',','.'));
			tmp.data[j-1][1]=parseFloat(row[j].replace(',','.'));
		}
		ser[i-1] = tmp;
	}
Highcharts.setOptions({lang: {
thousandsSep : ''}
});
	var tmp = new Highcharts.Chart({
        chart: {
	    renderTo: divn,
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
    }});
  }});
}