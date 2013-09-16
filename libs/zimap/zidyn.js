/* zidyn.js - javascript library for making a svg
 map chart with zimap.js dynamically, with data provided
 in content of SCRIPT tag
 2013-09-16
 
 Copyright (c) 2013 Ivan Zaytsev (zaycev.ivan@gmail.com)
 
 This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. 
 To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/ or send a letter 
 to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 */
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
//alert('1');
if(!window.zimapfuns){
//include zimap.js dynamically
var newscr = document.createElement('script');
//if(location.href.split('/')[2]=='127.0.0.1')
//	newscr.src = '/libs/zimap/zimap.js';
//else
	newscr.src = '//navizv.github.io/libs/zimap/zimap.js';
//newscr.defer = "defer";
//on script load create map in div
//newscr.onload = fun;
document.getElementsByTagName("head")[0].appendChild(newscr);
window.zimapfuns = [];
}
zimapfuns.push(fun);
//s.parentNode.appendChild(newscr);
}
else{
//alert('2');
fun();
}
})();