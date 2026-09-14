# Regles de travail avec Maxime

## Avant de modifier la page

1. **Rien n'est pousse sans un go explicite.** Montrer l'avant et l'apres,
   attendre la reponse, pousser ensuite. Meme pour un mot.
2. **Aucun fait invente.** Ne jamais ecrire un chiffre, une statistique ou une
   affirmation sur la retraite, les clients, les seances ou les soirees de jeu
   sans que Maxime l'ait donne. Si un fait manque, poser la question ou laisser
   un bloc `.todo` visible sur la page.
3. **Une ou deux questions a la fois**, jamais une liste de cinq.
4. **Reponse longue, puis TLDR a la fin.** Il veut toute l'information. Le
   resume va en bas, il ne remplace jamais le detail.
5. **Dire quand je ne suis pas sur**, dans la ligne meme, au lieu d'ecrire
   autour de facon fluide.

## Faits a ne jamais deformer

- Maxime est **praticien Core Energetics en formation**. Pas certifie. Jamais
  le mot « psychotherapeute » : le titre est protege au Quebec.
- Guide certifie FQME, escalade exterieure et Deep Water Solo, depuis 2018.
- Ne jamais nommer « Cat Ba Climbing » publiquement. Toujours
  « partenaire local agree ».
- Retraite : 16 au 21 novembre 2026, baie de Lan Ha. 3 495 $ CA, rabais a
  3 195 $ si paye avant le 5 octobre 2026. Depot 1 065 $.
- Zero place vendue a ce jour. Aucun temoignage de participant a la retraite.
  Les temoignages de grimpe ne servent pas a vendre les seances individuelles.
- Soirees de jeu : pas encore commencees. Jusqu'a 25 personnes, contribution
  volontaire, environ 15 $ suggere.

## Ecriture

- Eviter « ce n'est pas X, c'est Y ». Construction reflexe, sonne artificiel.
- Eviter les enumerations de trois qui finissent sur une image poetique.
- Eviter la phrase de fin qui claque.
- Eviter les intensificateurs vides : « vrai », « veritable », « exactement ».
- Ne pas justifier la phrase precedente par une phrase suivante. Couper.
- Ne pas annoncer le genre de son propre message.
- Varier la longueur des paragraphes.
- Vocabulaire de grimpeur, pas de coach marketing : « jeu de pieds » et non
  « aisance en pieds », « repertoire de mouvements » et non « vocabulaire de
  mouvement », « head game » et non « mindset ».
- Pas de tirets cadratins dans les courriels et les messages.

## Technique

- Un seul fichier `index.html`. Pas de framework, pas de compilation.
- Bilingue par cles `data-i18n`. Le francais du HTML est la source. Dans
  `DICT.en`, ecrire les vrais caracteres et pas les entites HTML.
- Verifier apres edition : compter les cles des deux cotes, rendu FR et EN a
  1280 et 390 px, quatre images qui chargent, aucune entite brute a l'ecran.
- Ne jamais decaler une image de fond en pixels hors du cadre
  (`calc(100% + 80px)`) : sur mobile l'image remplit exactement la boite et le
  decalage cree une bande repetee. Utiliser un pourcentage.
- Playwright n'atteint pas l'internet public : servir le depot avec
  `python3 -m http.server 8899` et capturer localhost, avec
  `wait_until='load'` car `networkidle` ne se produit jamais. Chromium est
  sous `/opt/pw-browsers/`, lancer avec `--no-sandbox --disable-dev-shm-usage`.
  Bloquer les requetes vers `fonts.g*`, elles ne passent pas le proxy.
- Deploiement Netlify depuis `main`. Un fichier sur une branche renvoie 404
  tant qu'il n'est pas fusionne.

## La retraite

Elle reste hebergee sur `corealivenessproject.com`, dans l'autre depot. Les
liens d'ici pointent vers
`https://corealivenessproject.com/retraite-dws-nov-2026/?lang=en`.
Ne pas copier la page de la retraite ici.
