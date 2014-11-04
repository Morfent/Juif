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
    //lagtest
    timestamp1: null,
    timestamp2: null,
    timestamp3: null,
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
                console.log('DEBUG: (Room ' + this.room + ') ' + t[3] + ': ' + t[4]);
                this.iscommand(c, t[4], t[3], this.room);
                this.autoresponses(c, t[4], t[3], this.room);
                this.bannedwords(c, t[4], t[3], this.room);
                this.checkYtlink(c, t[4], t[3], this.room);
                if (t[4] == 'PATA...') {
                    this.timestamp2 = Date.now();
                }
                if (t[4] == 'PON!') {
                    this.timestamp3 = Date.now();
                    this.lagtest(c, this.room);
                }
                break;
                //Ce qui se passe en PM
            case 'pm':
                console.log('DEBUG: (Room PM) ' + t[2] + ': ' + t[4]);
                this.iscommand(c, t[4], t[2], '#' + t[2]);
                this.autoresponses(c, t[4], t[2], '#' + t[2]);
                if (t[4] == 'PATA...') {
                    this.timestamp2 = Date.now();
                }
                if (t[4] == 'PON!') {
                    this.timestamp3 = Date.now();
                    this.lagtest(c, '#' + t[2]);
                }
                break;
            case 'J':
                //Bannissement permanant (expérimental)
                this.isBanned(c, t[2], this.room);
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
            if (typeof Cmd[command] === 'function') Cmd[command].call(this, c, params, from, room);
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

        //Whitelisted ?
        for (var i = 0; i < wl.length; i++) {
            if (makeId(user) == wl[i]) return true;
        }
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
            //Probabilité de 1/3 pour une réponse
            var c = Math.floor((Math.random() * 3 + 1));
            if (c == 1) this.talk(c, room, phrases[random] + ' ' + from);
            this.talk(c, room, phrases[random]);
        }
        //Salutations
        var words = ['hi', 'salut', 'bonjour', 'yo', 'slt'];
        if (words.indexOf(msg) > -1) {
            var phrases = fs.readFileSync('data/autohello.txt').toString().split("\n");
            var random = Math.floor((Math.random() * phrases.length) + 1);
            //Si l'utilisateur a un grade, on l'enlève du nom
            if (this.isRanked(from, '+')) from = from.substr(1);
            var p = Math.floor((Math.random() * 3 + 1));
            if (p == 1) this.talk(c, room, phrases[random] + ' ' + from);
        }
    },
    checkYtlink: function(c, msg, from, room) {
        var spl = msg.split(' ');
        var id = null;
        //Extraction de l'id de la vidéo depuis un message
        for (var i = 0; i < spl.length; i++) {
            var search = spl[i].indexOf('youtube.com/watch?v=');
            if (search > -1) {
                id = spl[i].split('=')[1];
                if (id.length != 11) {
                    id = spl[i].substring(spl[i].lastIndexOf("v=") + 1, spl[i].lastIndexOf("&list")).substr(1);
                }
            } else {
                return false;
            }
        }
        // Si l'extraction de l'id foire, on arrête la fonction
        // plutôt que de faire crasher le bot
        if (id.length != 11) return false;

        var reqOpts = {
            hostname: "gdata.youtube.com",
            method: "GET",
            path: '/feeds/api/videos/' + id + '?alt=json',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        var self = this;
        var data = '';

        var req = require('http').request(reqOpts, function(res) {
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function(chunk) {
                var obj = JSON.parse(data);
                if (self.isRanked(from, '+')) from = from.substr(1);
                self.talk(c, room, 'Video postée par ' + from + ': ' + '**' + obj.entry.title.$t + '**');
            });
        });
        req.end();
    },
    isBanned: function(c, user, room) {
        var banlist = fs.readFileSync('data/banlist.txt').toString().split('\n');

        for (var i = 0; i < banlist.length; i++) {
            var spl = banlist[i].toString().split('|');
            if (makeId(user) == spl[0] && room == spl[1]) {
                this.talk(c, room, '/rb ' + user + ', Bannissement permanant: ' + spl[2]);
            }
        }
    },
    bannedwords: function(c, msg, user, room) {
        var bannedwords = fs.readFileSync('data/bannedwords.txt').toString().split('\n');
        for (var i = 0; i < bannedwords.length; i++) {
            var spl = bannedwords[i].toString().split('|');
            if (!spl) return false;
            var index = msg.indexOf(spl[0]);
            if (index > -1 && room == spl[1]) {
                console.log('DEBUG: ' + spl[0] + ' est un mot banni.');
                this.talk(c, room, '/mute ' + user + ', Mot banni.');
            }
        }
    },
    lagtest: function(c, room) {
        //console.log('lancement de lagtest')
        console.log(this.timestamp1);
        console.log(this.timestamp2);
        if (this.timestamp2 != null && this.timestamp2 != null) {
            var lag1 = this.timestamp2 - this.timestamp1;
            var lag2 = this.timestamp3 - this.timestamp1;
            this.talk(c, room, 'Lag test: ' + Math.round(lag1) + ' / ' + Math.round(lag2) + ' ms.');
            this.timestamp1 = null;
            this.timestamp2 = null;
            this.timestamp3 = null;
        }
    },
    upToHastebin: function(c, from, room, data) {
        var self = this;
        var reqOpts = {
            hostname: "hastebin.com",
            method: "POST",
            path: '/documents'
        };

        var req = require('http').request(reqOpts, function(res) {
            res.on('data', function(chunk) {
                self.talk(c, room, (room.charAt(0) === '#' ? "" : "/pm " + from + ", ") + "hastebin.com/raw/" + JSON.parse(chunk.toString())['key']);
            });
        });

        req.write(data);
        req.end();
    }
};
