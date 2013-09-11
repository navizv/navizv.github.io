//new context for each map
(function(){

//take current script tag content
var scripts = document.getElementsByTagName('SCRIPT');
var s = scripts[scripts.length - 1];
var obj = eval('('+s.innerHTML+')');

//create div for map
var div = document.createElement('div');
s.parentNode.insertBefore(div,s);
var fun = function(){var zimap = new Zimap(div,obj);};

if(!window.Zimap){
//include zimap.js dynamically
var newscr = document.createElement('script');
newscr.src = '/libs/zimap/zimap.js';
//on script load create map in div
newscr.onload = fun;
s.parentNode.appendChild(newscr);
}
else{fun();}
})();