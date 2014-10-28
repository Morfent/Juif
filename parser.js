/*
 * Parser.js
 * Ce fichier sert à traiter les données reçues
 * Doc:
 * ** Faire parler le bot **
 *    this.talk(c, ROOM DÉSIRÉE, MESSAGE);
 *    --------------
 * ** Vérifier le grade d'un utilisateur: **
 *    this.isRanked(USER, GRADE MINIMUM REQUIS);
 *    Remarque: retourne 'true' ou 'false'
 */
var fs = require('fs');

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
                this.iscommand(c, t[4], t[3], this.room);
                this.autoresponses(c, t[4], t[3], this.room);
                break;
                //Ce qui se passe en PM
            case 'pm':
                console.log('(Room PM) ' + t[2] + ': ' + t[4]);
                this.iscommand(c, t[4], t[2], '#' + t[2]);
                this.autoresponses(c, t[4], t[2], '#' + t[2]);
                break;
            case 'J':
                //console.log(t);
                //Ban permanant (expérimental)
                break;
        }
    },
    //Message ou commande ?
    iscommand: function(c, msg, from, room) {
        if (msg.substr(0, comchar.length) === comchar) {
            //C'est une commande, on vérifie si elle existe
            msg = msg.substr(comchar.length);
            var index = msg.indexOf(' ');
            var params = null;
            if (index > -1) {
                var command = msg.substr(0, index);
                params = msg.substr(index + 1).trim();
            } else {
                var command = msg;
            }
            //La condition retourne 0 si la commande n'existe pas
            if (Cmd[command]) Cmd[command].call(this, c, params, from, room);
        }
    },
    talk: function(c, room, msg) {
        if (room.charAt(0) == '#') {
            var to = room.substr(1);
            var txt = '|/pm ' + to + ', ' + msg;
            send_datas(c, txt);
        } else {
            var txt = room + '|' + msg;
            send_datas(c, txt);
        }
    },
    isRanked: function(user, required) {
        var groups = {
            '~': {
                rank: 5,
                desc: 'Admin'
            },
            '&': {
                rank: 4,
                desc: 'Leader'
            },
            '#': {
                rank: 3,
                desc: 'Room Owner'
            },
            '@': {
                rank: 2,
                desc: 'Moderator'
            },
            '%': {
                rank: 1,
                desc: 'Driver'
            },
            '+': {
                rank: 0,
                desc: 'Voiced'
            }
        };
        var rank = user.charAt(0);
        if (!groups[rank]) return false;
        if (groups[rank].rank >= groups[required].rank) {
            return true;
        } else {
            return false;
        }
    },
    autoresponses: function(c, msg, from, room) {
        /*
         * Créer une instance de réponse aléatoire:
         * Rechercher le mot que vous souhaitez, exemple 'test':
         *     if (msg.indexOf('test') > -1) {//Instructions}
         * Créez votre fichier (exemple test.txt) dans le répertoire /data/
         * Vous pouvez y mettre une réponse par ligne.
         * Enfin dans le bloc d'instructions:
         *     var phrases = fs.readFileSync('data/NOMDUFICHIER.txt').toString().split("\n");
         *     var random = Math.floor((Math.random() * phrases.length) + 1);
         *     this.talk(c, room, phrases[random]);
         */
        if (!autoR) return false;
        if (msg.indexOf(botName) > -1) {
            var phrases = fs.readFileSync('data/autores.txt').toString().split("\n");
            var random = Math.floor((Math.random() * phrases.length) + 1);
            this.talk(c, room, phrases[random]);
        }
    }
};
