Juif Version 2.0 (beta)
===========

Juif est un bot pour [Pokemon Showdown][1]
[1]: https://pokemonshowdown.com/

Installation
============

Juif nécessite le logiciel node.js afin de pouvoir être lancé, la dernière version stable devrait convenir.
Ceci étant fait, il vous faudra installer les dépendances du bot. Pour cela, rendez-vous dans le dossier
correspondant grâce à cette commande (à exécuter sur le cmd.exe de Windows, dans le terminal pour Mac OS et dans votre console préférée sous Linux):

`cd dossier/ou/se/trouve/le/bot`

Puis exécuter la commande `npm install` qui installera automatiquement les dépendances nécessaires.

Félicitations, le bot est maintenant prêt à être lancer.

Commande de démarrage:

`node app.js PSEUDO MDP`
(Ne remplissez pas la partie MDP s'il n'y a pas de mot de passe.)

ou

`node app.js`

Si vous avez configuré le pseudo / mot de passe depuis le fichier conf.js

Documentation
=============

Ce qui est entre parenthèses est facultatif. <br/><br/>
Symbole ✓: La commande est prête <br/>
Symbole ☑: La commande est prête mais susceptible de bugger.<br/>
Symbole ✗: La commande n'est pas encore prête.<br/>
<br/><br/>
✓ !**about** - Crédits<br/>
✓ !**talk on/off** - Activer les réponses auto<br/>
✓ !**ab user(, reason)** - Bannissement définitif<br/>
✓ !**aub user** - Enlever le bannissement définitif<br/>
✓ !**rk user** - Permet de kicker un utilisateur<br/>
✓ !**banword mot** - Bannir une mot<br/>
✓ !**unbanword mot** - débannir un mot<br/>
✓ !**bl** - Afficher la liste des utilisateurs bannis définitivement<br/>
☑ !**tb user, durée** - Bannir une utilisateur temporairement (durée est un chiffre en minutes)<br/>
✓ !**fc add, code ami** - Permet à un utilisateur d'enregistrer/remplacer son CA dans la base de données du bot<br/>
✓ !**fc user** - Permet d'afficher le code ami d'un utilisateur enregistré dans la base de données du bot<br/>
✓ !**vdm** - Le bot poste une VDM<br/>
✓ !**repeat ID :: message :: durée (en min)** - Répéter un message à intervalles réguliers<br/>
✓ !**stoprepeat ID** - Arrêter un !repeat<br/>
✓ !**trad pokemon/attaque/cap spé** - Traduction FR -> EN et EN -> FR (détection automatique)<br/>
✓ !**8ball question** - 8ball<br/>
✓ !**lagtest** - Tester le lag (mesure du temps entre 2 messages postés)<br/>

Informations complémentaires
=============================

/!\ Attention /!\
Il s'agit d'une version beta. Le script n'est pas encore terminé à 100%. De ce fait, quelques bugs peuvent encore subsister.

Le nom du bot n'a en aucun cas une connotation raciste.

TODO list
=========

`!bs` : bescherelle des mongols <br/>
`this.logpm()` : enregistrement des PMS reçus <br/>
`this.checklink()` : liens de replays interdits (warn = désactivation du lien) 


