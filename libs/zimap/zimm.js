function zimap_draw(data,svgd,colors,j){
  zimap_draw_x(data,svgd,colors,j,';',1,false);
}

function zimap_draw_x(data,svgd,colors,j,colsep,strow,grad){
//��������� ����� ��� ������
  var mas = data.split('\n');
  var rn = mas.length;
  if(rn <= 0)
    return;
  var min = 0;
  var max = 0;

  var first = true;
  for(var i = strow; i< rn; i++){
	var row = mas[i].split(colsep);
//alert(mas[i]+colsep+row.length);
	var reg = row[0];
	var c = row[j];
	if(c == '')
		continue;
	var el = svgd.getElementById(reg);
	if(el == undefined || el == null)
		continue;
	var cur = parseFloat(c);
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

//������ �������
  var i = 0;
  var cury = 200;
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
    txt.setAttribute('y',cury);
    txt.textContent = ziformat(scl[cn-i]);
    cury+=h;
  }
  var txt = svgd.getElementById('tcol'+i);
  txt.setAttribute('x','1165');
  txt.setAttribute('y',cury);
  txt.textContent = ziformat(scl[cn-i]);
  cury+=75;
//Grid!!!
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
    txt.setAttribute('y',cury);
    txt.textContent = ziformat(scl[cn-i]);
    cury+=h;
  }
  var txt = svgd.getElementById('tcol'+i);
  txt.setAttribute('x','1165');
  txt.setAttribute('y',cury);
  txt.textContent = ziformat(scl[cn-i]);
  cury+=75;
}
//������ ������ ������ � ����� ��������
  var regs = svgd.getElementsByClassName('region');
  for(var i =0;i<regs.length;i++){
	var el = regs[i];
	el.setAttribute('fill','#808080');
	var tit = el.childNodes[1];
	tit.textContent = tit.textContent.split(':')[0];
  }


//����� �� ������, ��������� ����� � ������������
  for(var i = strow; i< rn; i++){
	var tmr = mas[i].split(colsep);
	var reg = tmr[0];
	var c = tmr[j];
	if(c == '')
		continue;
	var cur = parseFloat(c);
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
}else{
var col = Math.round(2*(1-pr)*255);
var s1 = col.toString(16);
if(s1.length == 1)
	s1='0'+s1;
strcol='#'+s1+'ff00';
}
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
		tit = el.childNodes[1];
//����������� - ���������� ������ � ������, ���� ���������
	  tit.textContent = tit.textContent + ': ' + cur;
	}
  }
}

function ziformat(f){
  return Math.round(f*100)/100;
}