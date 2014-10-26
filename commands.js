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
 
exports.Cmd = {
    about: function(c, params, from, room) {
        var txt = 'Bot créé par Keb avec la technologie javascript côté serveur node.js';
        this.talk(c, room, txt);
    }
};
