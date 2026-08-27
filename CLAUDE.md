# Regles de travail avec Maxime

## Avant de modifier une page

1. **Rien n'est pousse sans un go explicite.** Montrer l'avant et l'apres,
   attendre la reponse, pousser ensuite. Meme pour un mot.
2. **Aucun fait invente.** Ne jamais ecrire un chiffre, une statistique ou une
   affirmation sur la retraite, les clients ou le programme sans que Maxime
   l'ait donne. La retraite n'a jamais eu lieu : il n'y a pas de
   « participants precedents » a citer. Si un fait manque, poser la question
   ou laisser le trou visible.
3. **Une ou deux questions a la fois**, jamais une liste de cinq.
4. **Reponse longue, puis TLDR a la fin.** Il veut toute l'information, pas une
   version courte. Le resume va en bas, il ne remplace jamais le detail.
3b. **Reponse longue, puis TLDR a la fin.** Il veut toute l'information, pas une
   version courte. Le resume va en bas, il ne remplace pas le detail.
5. **Dire quand je ne suis pas sur**, dans la ligne meme, au lieu d'ecrire
   autour de facon fluide.

## Ecriture

- Eviter « ce n'est pas X, c'est Y ». Construction reflexe, sonne artificiel.
- Eviter les enumerations de trois qui finissent sur une image poetique.
- Eviter la phrase de fin qui claque.
- Eviter les intensificateurs vides : « vrai », « veritable », « exactement ».
- Ne pas justifier la phrase precedente par une phrase suivante. Couper.
- Ne pas annoncer le genre de son propre message.
- Varier la longueur des paragraphes. Six blocs de deux phrases = template.
- Vocabulaire de grimpeur, pas de coach marketing : « jeu de pieds » et non
  « aisance en pieds », « repertoire de mouvements » et non « vocabulaire de
  mouvement », « head game » et non « mindset ».
- Pas de tirets cadratins dans les courriels et les messages.

## Faits a ne jamais deformer

- Ne jamais nommer « Cat Ba Climbing » publiquement. Toujours « partenaire
  local agree ».
- Zero place vendue a ce jour. Aucun temoignage de participant a la retraite.

## Technique : page retraite-dws-nov-2026/index.html

- Dictionnaire bilingue : objets `T` (texte) et `TH` (HTML). La plupart des
  phrases FR existent sous deux cles, accentuee et non accentuee.
- `norm()` normalise apostrophes, guillemets, nbsp et tirets. Les accents ne
  sont PAS normalises : c'est la vraie source de bugs.
- Une cle manquante ne casse rien : le texte reste en francais en mode EN, et
  personne ne le remarque. Toujours verifier le rendu dans les deux langues.
- Les blocs `<style>` de la page viennent APRES le `<head>`. Une regle
  injectee par `add_style_tag` perd contre elles a specificite egale : pour
  tester un correctif, prefixer le selecteur par `html body`.
- Ne jamais decaler une image de fond en pixels hors du cadre
  (`calc(100% + 80px)`) : sur mobile l'image remplit exactement la boite et le
  decalage cree une bande repetee. Utiliser un pourcentage.
- Deploiement Netlify depuis `main`. Un fichier sur une branche renvoie 404
  tant qu'il n'est pas fusionne. Attendre que la nouvelle chaine apparaisse
  sur l'URL publique, pas seulement un code 200.
- Playwright n'atteint pas l'internet public : servir le depot avec
  `python3 -m http.server 8899` et capturer localhost, avec
  `wait_until='domcontentloaded'` car `networkidle` ne se produit jamais.
  Chromium a `/opt/pw-browsers/chromium`, lancer avec `--no-sandbox`.
- Verifier apres edition : compter les cles de `T` avant et apres,
  `node --check` sur le bloc du dictionnaire, `json.loads` sur les deux blocs
  JSON-LD, rendu FR et EN a 1280 et 390 px.

## Git

- Pousser uniquement sur `claude/corealiveness-retreat-dashboard-bg8y8e`.
- Apres une fusion en squash, la branche locale doit repartir de `origin/main`
  et le push demande `--force-with-lease`.
