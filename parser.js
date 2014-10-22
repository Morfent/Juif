exports.Parser = {
    room: '',
    parser: function(c, data) {
        if (data.indexOf('\n') > -1) {
            var spl = data.split('\n');
            for (var i = 0; i < spl.length; i++) {
                if (spl[i].split('|')[1] == 'init') {
                    //Pas de room
                    this.room = '';
                    break;
                }
                this.parser(c, spl[i]);
            }
        }
        var spl = data.split('|');
        //Si spl[1] n'existe pas, on parse >
        if (!spl[1]) {
            spl = data.split('>');
        }
        if (!spl[1]) return;
        //this.room, c'est là où "l'action se passe" :)
        this.room = spl[1];
        console.log(spl);
    }
};
