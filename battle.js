exports.Battling = {
    updatechallenges: function(c, room, data) {
        if (!data.challengesFrom) return false;
        var from = Object.getOwnPropertyNames(data.challengesFrom);
        var tier = data.challengesFrom[from];
        if (tier == 'randombattle') {
            this.talk(c, room, '/accept ' + from);
        } else {
            this.talk(c, room, '/pm ' + from + ', Désolé ' + from + ', je ne combats pas encore dans le tier ' + tier + '.');
            this.talk(c, room, '/decline ' + from);
        }
        console.log('coucou')
    },
    request: function(c, room, data) {
        console.log(data);
        if (typeof data === 'object') {
            this.idbot = data.side.id;
        }
        console.log('ID du bot: ' + this.idbot);
    },
    'switch': function(c, room, data) {

    },
    poke: function(c, room, data) {

    }
};
