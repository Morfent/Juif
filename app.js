/*
 * Juif, un bot Pokemon Showdown
 * Fichier principal
 */
var wsclient = require('websocket').client,
    sys = require('sys'),
    https = require('https');

/************************************
            ☆ CONFIG ☆
************************************/
//informations sur le serveur
var server = 'sim.smogon.com',
    port = 8000,
    rooms = ['franais'];
//Caractère servant à appeler une commande
global.comchar = '!';

//Réponses automatiques
global.autoR = true;

//Whitelist
global.wl = ['keb'];

if (!process.argv[2]) {
    console.log('Veuillez spécifier un nom d\'utilisateur.');
    process.exit(-1)
}

global.Parser = require('./parser.js').Parser;
global.Cmd = require('./commands.js').Cmd;

//Dex (noms des pokemons)
//On précharge une bonne fois pour toute
global.trad = require('./data/trad/pokemondatas.js');

global.send_datas = function(conn, d) {
    if (conn.connected) {
        d = JSON.stringify(d);
        conn.send(d);
    }
};

global.makeId = function(d) {
    return d.toLowerCase().replace(/[^a-z0-9]/g, '');
}

var username = makeId(process.argv[2]),
    pw = process.argv[3];

global.botName = username;

/*
 * Cette fonction ne retourne pas les éventuelles erreurs
 * qui peuvent survenir (mauvais id/pass par exemple).
 * C'est pas une priorité pour le moment, si vous rentrez
 * des informations correctes, il ne devrait pas y avoir de
 * problème.
 */
function login(username, pw, id, challstr, conn) {
    var reqOpt = {
        hostname: 'play.pokemonshowdown.com',
        port: 443,
        path: '/action.php',
        agent: false
    };
    if (!pw) {
        reqOpt.method = 'GET';
        reqOpt.path += '?act=getassertion&userid=' + username + '&challengekeyid=' + id + '&challenge=' + challstr;
    } else {
        reqOpt.method = 'POST';
        var stuff = 'act=login&name=' + username + '&pass=' + pw + '&challengekeyid=' + id + '&challenge=' + challstr;
        reqOpt.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': stuff.length
        };
    }

    var req = https.request(reqOpt, function(r) {
        r.setEncoding('utf8');
        var d = '';
        r.on('data', function(chunk) {
            d += chunk;
        });
        r.on('end', function() {
            try {
                d = JSON.parse(d.substr(1));
                if (d.actionsuccess) {
                    d = d.assertion;
                } else {
                    process.exit(-1);
                }
            } catch (e) {}
            send_datas(conn, '|/trn ' + username + ',0,' + d);
        });
    });
    if (stuff) {
        req.write(stuff);
    }
    req.end();
}

var ws = new wsclient();

//Oui, la connexion est assez dégueulasse à faire, désolé !
ws.on('connect', function(conn) {
    conn.on('message', function(res) {
        if (res.type === 'utf8') {
            if (res.utf8Data.charAt(0) === 'a') {
                var data = JSON.parse(res.utf8Data.substr(1))[0];
                tempdata = data.split('|');
                if (tempdata[1] == 'challstr') {
                    login(username, pw, tempdata[2], tempdata[3], conn);
                }
                if (tempdata[1] == 'updateuser') {
                    //Pas de vérification des information de connexion pour le moment. Deal w/ it.
                    if (tempdata[2] !== username) return;
                    if (tempdata[3] !== '1') {
                        console.log('Echec de la connexion.')
                        process.exit(-1);
                    }
                    //Tout est ok
                    console.log('Connecté en tant que ' + username);
                    //On rejoint les rooms
                    for (var i = 0; i < rooms.length; i++) {
                        send_datas(conn, '|/join ' + rooms[i]);
                    }

                }
                Parser.parser(conn, data);
            }
        }
    });
});

var hi = 'ws://' + server + ':' + port + '/showdown/540045/random12/websocket';
ws.connect(hi);
