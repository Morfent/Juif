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
        if (!this.isRanked(from, '@')) return false;
        var txt = 'Réponses automatiques ';
        if (params === 'on') {
            autoR = true;
            txt += 'activées.';
        } else if (params === 'off') {
            autoR = false;
            txt += 'désactivées.'
        } else {
            //Précaution
            txt = 'Une erreur est survenue.'
        }
        this.talk(c, room, txt);
    },
    ab: function (c, params, from, room) {
        if (!this.isRanked(from, '@')) return false;
        if (!params) return false;
        var opts = params.split(',');
        if (opts[1].indexOf(',') > 1) return false;
        var data = makeId(opts[0]) + '|' + room + '|' + opts[1];
        fs.appendFile('data/banlist.txt', '\n' + data, function (err){
            console.log(err);
        });
        //On vire les sauts de lignes inutiles
        var e = fs.readFileSync('data/banlist.txt').toString();
        var output = e.replace(/^\s*$[\n\r]{1,}/gm, '');
        fs.writeFileSync('data/banlist.txt', output);
        this.talk(c, room, 'Ban permanant pour ' + opts[0] + ': ' + opts[1]);
    },
    aub: function (c, params, from, room) {
        if (!this.isRanked(from, '#')) return false;
        if (!params) return false;

        var success = false;
        var banlist = fs.readFileSync('data/banlist.txt').toString().split('\n');
        var editedbanlist = fs.readFileSync('data/banlist.txt').toString();

        for (var i = 0; i < banlist.length; i++) {
            var spl = banlist[i].toString().split('|');
            if (makeId(params) == spl[0]) {
                var search = spl[0] + '|' + spl[1] + '|' + spl[2];
                var idx = editedbanlist.indexOf(search);
                if (idx >= 0) {
                    var output = editedbanlist.substr(0, idx) + editedbanlist.substr(idx + search.length);
                    //On tej la ligne vide inutile qui fait planter le script
                    var output = output.replace(/^\s*$[\n\r]{1,}/gm, '');
                    fs.writeFileSync('data/banlist.txt', output);
                    this.talk(c, room, spl[0] + ' a bien été débanni.');
                    success = true;
                }
            }
        }
        if (success == false) this.talk(c, room, params + ' n\'est pas banni.');
    }
};
