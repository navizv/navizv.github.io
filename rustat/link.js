function linkEncode(obj){
    var str = "";
    $.each(obj,function (f,v){
        if(str!="")
            str+="&";
        //v-massive???
        if(f=="pars"||f=="regs"||f=="dops")
            v = v.join("_").replace(/\//g,"\*");
        str+=f+"="+encodeURIComponent(v);
    });
    return str;
}

function linkDecode(str){
    var obj = {};
    $.each(str.split("&"), function (i,v){
        var p = v.split("=");
        obj[p[0]] = decodeURIComponent(p[1]);
        if(p[0]=="pars"||p[0]=="regs"||p[0]=="dops")
            obj[p[0]] = obj[p[0]].replace(/\*/g,"\/").split("_");
    });
    return obj;
}