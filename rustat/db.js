function Selector() {
    this.getRegs = function (){
        return regs;
    }
    this.getTree = function (){
        return regTree;
    }
    var regs = [];
    var regTree = [];
    //read iso
    $.ajax({
        url: "db/regs/iso3166.csv",
        dataType: "text",
        async: false,
        success: function(data) {
            var mas = data.split("\r\n");
            for (var i in mas) {
                if (mas[i] == "")
                    continue;
                regs[i] = mas[i].split(";");
            }
        }
    });
    //read tree
    $.ajax({
        url: "db/regs/tree.csv",
        dataType: "text",
        async: false,
        success: function(data) {
            var mas = data.split("\r\n");
            var cur = null;
            var ii = 0;
            var jj = 0;
            for (var i in mas) {
                if (mas[i] == "")
                    continue;
                var str = mas[i].split(";");
                if(str[0] == 1 || str[0] == 2){
                    cur = regTree[ii++] = {
                        type: str[0],
                        code: str[1],
                        text: str[2],
                        leaves: []
                    }
                    jj = 0;
                }else {
                    cur.leaves[jj++] = {
                        type: 0,
                        code: str[0],
                        text: str[1],
                    }
                }
            }
        }
    });
    
}