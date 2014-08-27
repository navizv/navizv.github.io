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
    this.sdops = [];
    this.iso = false;
    this.clearSelect = function() {
        this.spars = [];
        this.sregs = [];
        this.sdops = [];
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
    this.selDop = function(iso) {
        for (var i in this.sdops) {
            var r = this.sdops[i];
            if (r == iso)
                return true;
        }
        return false;
    }
    var self = this;
    this.getParName = function(pid) {
        var s = pid.lastIndexOf('/');
        var pn = pid.substr(s + 1);
        var res = "";
        $.ajax({
            url: "db/pars/" + pid.substr(0, s + 1) + 'list.csv',
            dataType: "text",
            async: false,
            success: function(data) {
                var mas = data.replace(/\r/g, '').split("\n");
                for (var i in mas) {
                    if (mas[i] == "")
                        continue;
                    var str = mas[i].split(";");
                    if (str[0] == pn) {
                        res = str[1];
                        return;
                    }
                }
            }
        });
        return res;
    }
    this.select = function(finish) {
        var mapa = (this.spars[0].type=="21");
        $.ajax({
            url: "db/pars/" + this.spars[0].id + ".csv",
            dataType: "text",
            success: function(data) {
                var tab = [];
                var mas = data.replace(/\r/g, '').split("\n");
                var ii = 0;
                for (var i in mas) {
                    if (mas[i] == "")
                        continue;
                    var line = mas[i].split(";");
                    if(i != 0 &&
                        (mapa && !self.selReg(line[0]) ||
                        !mapa && !self.selDop(line[0])))
                        continue;
                    if(mapa)
                        tab[ii] = line;
                    else
                        tab[ii] = line.slice(1);
                    if (mapa && !self.iso)
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
        });
    }
    this.setPossibleRegs = function(finish) {
        if (!(this.spars[0] && this.spars[0].type === "22")) {
            $.ajax({
                url: "db/pars/" + (this.spars[0] ? this.spars[0].id : this.ps) + ".csv",
                dataType: "text",
                async: false,
                success: function(data) {
                    var tab = [];
                    var mas = data.replace(/\r/g, '').split("\n");
                    for (var i in mas) {
                        if (i==0||mas[i] == "")
                            continue;
                        tab.push(mas[i].split(";")[0]);
                    }
                    finish(tab);
                }
            });
        } else {
            $.ajax({
                url: "db/pars/" + this.spars[0].id + ".csv",
                dataType: "text",
                async: false,
                success: function(data) {
                    var tab = [];
                    var mas = data.replace(/\r/g, '').split("\n");
                    for (var i in mas) {
                        if (i==0||mas[i] == "")
                            continue;
                        var tmp = mas[i].split(";");
                        tab.push({id:tmp[0],text:tmp[1]});
                    }
                    finish(tab,true);
                }
            });
        }
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