/*
 *  commands.js
 *  Toutes (ou presque) les commandes du bot
 *  doivent se trouver ici.
 *  Doc:
 *  Pour une commande de type:
 *  /cmd param1, param2
 *  La variable params contient les paramètres
 *  de la commande, qui sont à parser comme on veut
 *  from: celui qui exécute la commande
 *  room: room où la commande a été lancée
 */
var fs = require('fs');

exports.Cmd = {
    about: function(c, params, from, room) {
        var txt = 'Bot créé par Keb avec la technologie javascript côté serveur node.js';
        this.talk(c, room, txt);
    },
    '8ball': function(c, params, from, room) {
        var phrases = fs.readFileSync('data/8ball.txt').toString().split("\n");
        var random = Math.floor((Math.random() * phrases.length) + 1);
        if (this.isRanked(from, '+')) {
            this.talk(c, room, phrases[random]);
        } else {
            this.talk(c, room, '/pm ' + from + ', ' + phrases[random]);
        }
    },
    talk: function(c, params, from, room) {
        if (!this.isRanked(user, '@')) return false;
        var txt = 'Réponses automatiques ';
        if (params === 'on') {
            autoR = true;
            txt += 'activées.';
        } else if (params === 'off') {
            autoR = false;
            txt += 'désactivées.'
        } else {
            txt = 'Une erreur est survenue.'
        }
        this.talk(c, room, txt);
    },
    ab: function(c, params, from, room) {
        var opts = params.split(',');
        Banlist[opts[0]] = opts[1];
        fs.writeFileSync('data/banlist.js', JSON.stringify(Banlist));
    }
};
