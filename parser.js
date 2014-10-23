/*
 * Parser.js
 * Ce fichier sert à traiter les données reçues
 */
exports.Parser = {
    room: '', // La room où se passe l'action, acualisée en permanence
    parser: function(c, data) {
        if (!data) return;
        if (data.indexOf('\n') > -1) {
            var spl = data.split('\n');
            for (var i = 0; i < spl.length; i++) {
                /*if (spl[i].split('|')[1] && (spl[i].split('|')[1] === 'init' || spl[i].split('|')[1] === 'tournament')) {
					this.room = '';
					break;
				}*/
                this.parser(c, spl[i]);
            }
            return;
        }
        var spl = data.split('|');
        if (!spl[1]) {
            spl = data.split('>');
            if (!spl[1])
                return;
            this.room = spl[1];
        }
        switch (spl[1]) {
            case 'c:':
                console.log('(Room ' + this.room + ') ' + spl[3] + ': ' + spl[4]);
                break;
            case 'pm':
                console.log('pm reçu !');
                this.talk();
                break;
        }
    },
    talk: function(c, from, room, msg) {
       //Censé envoyer un message
    }
};
