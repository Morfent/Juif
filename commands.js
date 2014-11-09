/*
 *  commands.js
 *  Toutes (ou presque) les commandes du bot
 *  doivent se trouver ici.
 *  Doc:
 *  Pour une commande de type:
 *  /cmd params
 *  La variable params contient les paramètres
 *  de la commande, qui sont à parser comme on veut
 *  from: celui qui exécute la commande
 *  room: room où la commande a été lancée
 */
var fs = require('fs');
var parseString = require('xml2js').parseString;

exports.Cmd = {
    /***********************************
     *       ☆ CRÉDITS ☆
     ***********************************/

    about: function(c, params, from, room) {
        var txt = 'Juif est un bot créé par Keb avec la technologie javascript côté serveur node.js. Ce bot est open source: https://github.com/Kebabier/Juif';
        if (this.isRanked(from, '+')) {
            this.talk(c, room, txt);
        } else {
            this.talk(c, room, '/pm ' + from + ', ' + txt);
        }
    },

    /***********************************
     *       ☆ MODÉRATION ☆
     ***********************************/

    ab: function(c, params, from, room) {
        if (!this.isRanked(from, '@') || !params) return false;
        var opts = params.split(',');
        if (!opts[1]) opts[1] = 'Pas de motif.';
        var data = makeId(opts[0]) + '|' + room + '|' + opts[1];
        fs.appendFile('data/banlist.txt', '\n' + data, function(err) {
            console.log(err);
        });
        //On vire les sauts de lignes inutiles
        var e = fs.readFileSync('data/banlist.txt').toString();
        var output = e.replace(/^\s*$[\n\r]{1,}/gm, '');
        fs.writeFileSync('data/banlist.txt', output);
        this.talk(c, room, '/rb ' + opts[0] + ', Ban permanant pour ' + opts[0] + ': ' + opts[1]);
        this.talk(c, room, '/modnote Ban permanant pour ' + opts[0] + ': ' + opts[1]);
    },

    aub: function(c, params, from, room) {
        if (!this.isRanked(from, '#') || !params) return false;

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
                    this.talk(c, room, '/roomunban ' + spl[0]);
                    this.talk(c, room, spl[0] + ' a bien été débanni.');
                    success = true;
                }
            }
        }
        if (success == false) this.talk(c, room, params + ' n\'est pas banni.');
    },

    banword: function(c, params, from, room) {
        if (!this.isRanked(from, '@') || !params) return false;
        fs.appendFile('data/bannedwords.txt', params + '|' + room + '\n', function(err) {
            console.log(err);
        });
        this.talk(c, room, 'Le mot "' + params + '" a bien été banni de la room ' + room + '.');
    },

    unbanword: function(c, params, from, room) {
        if (!this.isRanked(from, '#') || !params) return false;

        var success = false;
        var bannedwords = fs.readFileSync('data/bannedwords.txt').toString().split('\n');
        var editedBannedWords = fs.readFileSync('data/bannedwords.txt').toString();

        for (var i = 0; i < bannedwords.length; i++) {
            var spl = bannedwords[i].toString().split('|');
            if (makeId(params) == spl[0] && spl[1] == room) {
                var search = spl[0] + '|' + spl[1];
                var idx = editedBannedWords.indexOf(search);
                if (idx >= 0) {
                    var output = editedBannedWords.substr(0, idx) + editedBannedWords.substr(idx + search.length);
                    var output = output.replace(/^\s*$[\n\r]{1,}/gm, '');
                    fs.writeFileSync('data/bannedwords.txt', output);
                    this.talk(c, room, 'Le mot "' + spl[0] + '" a bien été débanni de la room' + spl[1] + '.');
                    success = true;
                }
            }
        }
        if (success == false) this.talk(c, room, 'Le mot "' + params + '" n\'est pas banni.');
    },

    bl: function(c, params, from, room) {
        if (!this.isRanked(from, '@')) return false;
        var banlist = fs.readFileSync('data/banlist.txt').toString().split('\n');
        var str = '';
        for (var i = 0; i < banlist.length; i++) {
            var spl = banlist[i].toString().split('|');
            str += spl[0] + ' (' + spl[1] + ') Motif: ' + spl[2] + '\n';
        }
        this.upToHastebin(c, from, room, str);
    },

    tb: function(c, params, from, room) {
        if (!this.isRanked(from, '#')) return false;
        var opts = params.split(',');
        if (!opts[1]) return false;
        var to = opts[0];
        var time = opts[1] * 60 * 1000;
        var self = this;
        this.talk(c, room, '/rb ' + to + ', Ban temporaire de ' + time + ' minutes.');
        setTimeout(function() {
            self.talk(c, room, '/roomunban ' + to);
        }, time);
    },

    /*******************************************
     *       ☆ FONCTIONNALITÉS DIVERSES ☆
     *******************************************/
    fc: function(c, params, from, room) {
        var opts = params.split(',');
        var success = false;

        if (!opts[1]) {
            var fc = fs.readFileSync('data/fc.txt').toString().split('\n');
            for (var i = 0; i < fc.length; i++) {
                var spl = fc[i].toString().split('|');
                if (makeId(params) == spl[0]) {
                    this.talk(c, room, 'Le code ami de ' + params + ' est: ' + spl[1]);
                    success = true;
                }
            }
            if (!success) {
                this.talk(c, room, 'Le code ami de ' + params + ' n\'est pas encore enregistré.');
            }
        }

        if (opts[0] == 'add') {
            if (opts[1].length != 15) {
                this.talk(c, room, 'Un code ami doit être composé que de 12 chiffres.');
                return false;
            }
            //S'il existe déjà, bah on écrase et on change
            var e = fs.readFileSync('data/fc.txt').toString().split('\n');
            var f = fs.readFileSync('data/fc.txt').toString();
            for (var i = 0; i < e.length; i++) {
                var spl = e[i].toString().split('|');
                if (spl[0] == makeId(from)) {
                    var search = makeId(from) + '|' + spl[1];
                    var idx = f.indexOf(search);
                    if (idx >= 0) {
                        var output = f.substr(0, idx) + f.substr(idx + search.length);
                        var output = output.replace(/^\s*$[\n\r]{1,}/gm, '');
                        fs.writeFileSync('data/fc.txt', output);
                        this.talk(c, room, 'Votre code ami a bien été remplacé par ' + opts[1]);
                    }
                }
            }
            fs.appendFile('data/fc.txt', makeId(from) + '|' + opts[1] + '\n', function(err) {
                console.log(err);
            });
            this.talk(c, room, 'Votre code ami a bien été enregistré.');
        }
    },

    rk: function(c, params, from, room) {
        if (!this.isRanked(from, '#')) return false;
        this.talk(c, room, '/rb ' + params + ', La team reocket s\'en va vers d\'autres cieeeeeeeux !');
        this.talk(c, room, '/roomunban ' + ', ' + params);
    },

    vdm: function(c, params, from, room) {
        if (!this.isRanked(from, '+')) return false;
        //y a ma clé API VDM, vous avez vu comment je suis gentil ?
        var self = this;
        var reqOpts = {
            hostname: "api.fmylife.com",
            method: "GET",
            path: '/view/random/sexe?language=fr&key=5395d4752b0a9'
        };
        var data = '';
        var req = require('http').request(reqOpts, function(res) {
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function(chunk) {
                parseString(data, function(err, result) {
                    if (err) throw err;
                    self.talk(c, room, result.root.items[0].item[0].text);
                });
            });
        });
        req.end();
    },

    repeat: function(c, params, from, room) {
        this.talk(c, room, 'Cette commande est en cours de développement.');
    },

    trad: function(c, params, from, room) {
        var item = makeId(params);
        if (!this.isRanked(from, '+')) room = '#' + from;
        if (trad.nameToEn[item]) {
            this.talk(c, room, 'Nom du pokemon en anglais: ' + trad.nameToEn[item]);
        } else if (trad.nameToFr[item]) {
            this.talk(c, room, 'Nom du pokemon en français: ' + trad.nameToFr[item]);
        } else if (trad.moveToEn[item]) {
            this.talk(c, room, 'Nom de l\'attaque en anglais: ' + trad.moveToEn[item]);
        } else if (trad.moveToFr[item]) {
            this.talk(c, room, 'Nom de l\'attaque en français: ' + trad.moveToFr[item]);
        } else if (trad.abilityToEn[item]) {
            this.talk(c, room, 'Nom de la capacité spéciale en anglais: ' + trad.abilityToEn[item])
        } else if (trad.abilityToFr[item]) {
            this.talk(c, room, 'Nom de la capacité spéciale en français: ' + trad.abilityToFr[item])
        } else {
            this.talk(c, room, 'Rien n\'a été trouvé.')
        }
    },

    '8ball': function(c, params, from, room) {
        var phrases = fs.readFileSync('data/8ball.txt').toString().split("\n");
        var random = Math.floor((Math.random() * phrases.length) + 1);

        if (this.isRanked(from, '+')) {
            this.talk(c, room, '(' + from.substr(1) + ') ' + phrases[random]);
        } else {
            this.talk(c, room, '/pm ' + from + ', ' + phrases[random]);
        }
    },
    fagtest: function(c, params, from, room) {
        if (!this.isRanked(from, '%')) return false;
        this.talk(c, room, 'PATA...');
        this.talk(c, room, 'PON!');
        this.timestamp1 = Date.now();
    },
    talk: function(c, params, from, room) {
        if (!this.isRanked(from, '@')) return false;
        var txt = 'Réponses automatiques ';
        if (params === 'on') {
            Conf.autoR = true;
            txt += 'activées.';
        } else if (params === 'off') {
            Conf.autoR = false;
            txt += 'désactivées.'
        } else {
            //Précaution
            txt = 'Vous devez utiliser le paramètre "on" ou "off".'
        }
        this.talk(c, room, txt);
    }
};
