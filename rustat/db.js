function Selector() {
    this.getRegs = function() {
        return regs;
    }
    this.getTree = function() {
        return regTree;
    }
    var regs = [];
    var regTree = [];
    this.spars = [];
    this.sregs = [];
    this.iso = false;
    this.clearSelect = function() {
        this.spars = [];
        this.sregs = [];
    }
    this.findISO = function(iso) {
        for (var i in regs) {
            var r = regs[i];
            if (r[0] === iso)
                return r[1];
        }
        return "";
    }
    this.selReg = function(iso) {
        for (var i in this.sregs) {
            var r = this.sregs[i];
            if (r == iso)
                return true;
        }
        return false;
    }
    var self = this;
    this.select = function(finish) {
        $.ajax({
            url: "db/pars/" + this.spars[0].id+".csv",
            dataType: "text",
            success: function(data) {
                var tab = [];
                var mas = data.replace(/\r/g, '').split("\n");
                var ii = 0;
                for (var i in mas) {
                    if (mas[i] == "")
                        continue;
                    var line = mas[i].split(";");
                    if (i != 0 && !self.selReg(line[0]))
                        continue;
                    tab[ii] = line;
                    if (!self.iso)
                        tab[ii][0] = self.findISO(tab[ii][0]);
                    for (var j in tab[ii]) {
                        if (j == 0)
                            continue;
                        tab[ii][j] = parseFloat(tab[ii][j].replace(",", ".").replace(/ /g, ""));
                    }
                    ii++;
                }
                finish(tab, self.spars[0].text);
            }
        })
    }
    //read regs iso codes
    $.ajax({
        url: "db/regs/iso3166.csv",
        dataType: "text",
        async: false,
        success: function(data) {
            var mas = data.replace(/\r/g, '').split("\n");
            for (var i in mas) {
                if (mas[i] == "")
                    continue;
                regs[i] = mas[i].split(";");
            }
        }
    });
    //read reg tree
    $.ajax({
        url: "db/regs/tree.csv",
        dataType: "text",
        async: false,
        success: function(data) {
            var mas = data.replace(/\r/g, '').split("\n");
            var cur = null;
            var ii = 0;
            var jj = 0;
            for (var i in mas) {
                if (mas[i] == "")
                    continue;
                var str = mas[i].split(";");
                if (str[0] == 1 || str[0] == 2) {
                    cur = regTree[ii++] = {
                        type: str[0],
                        code: str[1],
                        text: str[2],
                        leaves: []
                    }
                    jj = 0;
                } else {
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