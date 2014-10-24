/*
 * Parser.js
 * Ce fichier sert à traiter les données reçues
 *
 */
exports.Parser = {
    room: '', // La room où se passe l'action, acualisée en permanence
    parser: function(c, data) {
        if (!data) return;
        if (data.indexOf('\n') > -1) {
            var spl = data.split('\n');
            for (var i = 0; i < spl.length; i++) {
                if (spl[i].split('|')[1] && (spl[i].split('|')[1] === 'init' || spl[i].split('|')[1] === 'tournament')) {
                    this.room = '';
                    break;
                }
                this.parser(c, spl[i]);
            }
            return;
        }
        var t = data.split('|');
        if (!t[1]) {
            t = data.split('>');
            if (!t[1])
                return;
            this.room = t[1];
        }
        switch (t[1]) {
            //Ce qui se passe sur la room
            case 'c:':
                console.log('(Room ' + this.room + ') ' + t[3] + ': ' + t[4]);
                this.parsechat(c, t[3], this.room, t[4]);
                break;
                //Ce qui se passe en PM
            case 'pm':
                console.log('(Room PM) ' + t[3] + ': ' + t[4]);
                break;
        }
    },
    //Message ou commande ?
    parsechat: function(c, msg, from, room) {

    },
    talk: function(c, room, msg) {
        var txt = room + '|' + msg;
        send_datas(c, txt);
    }
};
