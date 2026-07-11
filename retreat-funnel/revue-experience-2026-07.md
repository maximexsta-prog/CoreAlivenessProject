# 🔍 Revue complète de l'expérience client — Funnel retraite DWS

**Date :** nuit du 11 au 12 juillet 2026 · **Portée :** page retraite → formulaire → réservation → Interac → merci → politique, FR + EN, desktop + mobile.
**Méthode :** capture réelle de chaque écran et de chaque ligne de texte dans un navigateur, puis revue par 7 lentilles indépendantes (copie FR, traduction EN, conversion/CRO, design UI, UX formulaire, confiance/logistique, technique), recoupée et vérifiée contre le code. ~140 trouvailles retenues après élimination des faux positifs.

## Verdict global

**Le funnel est déjà bien au-dessus de la moyenne** — structure de vente long-format solide, objections traitées avec franchise, early bird daté et honnête, formulaire fluide, ton tutoiement chaleureux et constant. Notes des lentilles : copie FR 7/10 · EN 7/10 · conversion 6/10 · UI 6,5/10 · formulaire 7/10 · confiance/logistique 5/10.

**Ce qui le sépare du world-class tient en trois familles :**
1. **Des vestiges d'anciennes versions** qui contredisent le message actuel (page merci « liste d'attente », « avant l'ouverture officielle des inscriptions », réponse FAQ « format en préparation »).
2. **Des chiffres et engagements qui ne se recoupent pas entre les pages** (solde faux dans la politique, matériel inclus vs à apporter, assurance optionnelle vs obligatoire, 5 jours vs itinéraire de 6 jours).
3. **La couche logistique d'un achat à 3 720 $** : impossible de réserver un vol avec l'info affichée, pas d'échéancier de paiement, opérateur anonyme, pas de « et si j'annule ? » visible.

Presque tout est du texte — aucune refonte nécessaire.

---

## 🚨 TOP 10 — à corriger en premier

### 1. La page `/merci-retraite-dws/` dit encore « liste d'attente » (4 lentilles sur 6)
Vouvoiement + message faux (« Vous êtes maintenant sur la liste d'attente ») alors que le flux est candidature → appel → dépôt. La page est orpheline (plus rien n'y pointe depuis le site) **mais** d'anciens courriels/pubs peuvent encore y mener, et elle tire des conversions `Lead` à chaque visite (pollution des stats).
**Fix :** la réécrire sur le modèle de l'écran de confirmation du formulaire (« Candidature reçue ! … court appel … d'ici 24 h ») — ou la retirer et rediriger vers la page retraite via `_redirects`.

### 2. La politique de réservation contient une erreur de calcul (contractuel !)
« Dépôt 1240 CAD … solde de **2595 CAD** » → 1 240 + 2 595 = 3 835, qui ne correspond à AUCUN tarif. Sur le document contractuel, c'est un risque de litige.
**Fix :** « Dépôt de réservation : 1 240 CAD jusqu'au 8 septembre 2026 (1 400 CAD ensuite). Solde : 2 480 CAD au tarif early bird, 2 595 CAD au tarif régulier, payable au plus tard le **[fixe une date, ex. 19 septembre 2026]**. »

### 3. Impossible de réserver un vol avec l'info affichée
Aucune date de fin (« Date : 19 octobre » + itinéraire Jour 1→6), aucun aéroport, aucune heure de début/fin, aucun point de rencontre. C'est LA première question logistique d'un acheteur.
**Fix :** partout « **Du 19 au 24 octobre 2026** » + un petit bloc « Comment se rendre » : *« Vol vers Hanoï (Noi Bai). Rendez-vous à Cat Ba le 19 octobre en après-midi — guide détaillé (transfert Hanoï–Cat Ba ~4 h) envoyé après ton dépôt. Fin le 24 octobre en matinée ; prévois ton retour depuis Hanoï en soirée ou le lendemain. »*

### 4. « 5 jours » vs itinéraire « Jour 1 → Jour 6 »
La page vend 5 jours, l'itinéraire en compte 6. Le lecteur ne sait pas combien bloquer au calendrier.
**Fix :** trancher pour « **6 jours / 5 nuits** » (ou « 5 jours pleins + matinée de départ ») et harmoniser héro, intro, « On s'occupe de tout », politique.

### 5. Assurance : « si nécessaire » vs « obligatoire »
Page retraite : « Assurance… **si nécessaire** ». Page réservation : « je m'engage à détenir l'**assurance obligatoire** (sports extrêmes + rapatriement) ». Le client découvre une obligation au moment de payer.
**Fix (même phrase sur les 3 pages) :** « Assurance voyage **obligatoire** couvrant l'escalade/les sports d'aventure, les soins médicaux et le rapatriement (une preuve te sera demandée avant le départ). »

### 6. Vestiges « pré-lancement » qui contredisent « Inscriptions ouvertes »
- « **La liste finale sera confirmée avant l'ouverture officielle des inscriptions.** » (section Inclus)
- « selon la formule finale » (×2 dans Inclus) et « sauf indication contraire » (×2)
- FAQ « Le programme est-il fixe ? » : « **Le format est en préparation** »
- FAQ « En quelle langue » : « en français **ou en anglais selon le groupe** » — contredit le bloc objection « la retraite se déroule en français, c'est sa particularité »
**Fix :** supprimer la phrase d'ouverture-officielle ; figer les inclusions ; FAQ programme → « Le programme est volontairement flexible : l'ordre des journées s'ajuste à la météo, aux marées et au niveau du groupe » ; FAQ langue → aligner sur « menée en français » (+ guides locaux anglophones).

### 7. Matériel : inclus… ou à apporter ?
Politique : « Inclusions : **équipement d'escalade et de DWS** ». Page : « À prévoir : **chaussures d'escalade, baudrier** et matériel personnel ». Le client ne sait pas quoi mettre dans sa valise.
**Fix :** trancher, ex. « Inclus : matériel technique de DWS et d'escalade (cordes, dégaines, casques, kayaks). Apporte tes chaussons (et ton baudrier si tu en as un — prêt possible). » Même liste sur les deux pages.

### 8. Formulaire — 3 bugs de robustesse
a) **Validation de la date de naissance quasi inexistante** : « 31/02/2000 » passe, « 99 » passe, un·e né·e en déc. 2008 (17 ans au départ) passe. C'est la seule barrière 18+.
b) **Un refresh ou swipe-back mobile efface les 13 réponses** — risque d'abandon n°1 (fix : sessionStorage, ~10 lignes).
c) **Double soumission possible** (Entrée pendant « Envoi… » → 2ᵉ POST Formspree) + bouton Retour masqué sur la dernière question (impossible de vérifier ses réponses avant d'envoyer).

### 9. Opérateur anonyme + circuit de paiement incohérent
« Le paiement est traité par notre partenaire local agréé — Core Aliveness ne reçoit pas directement le paiement »… mais l'Interac va vers ton numéro personnel (438-345-1888 = aussi ton WhatsApp). Un lecteur attentif voit la contradiction, et « partenaire agréé » jamais nommé rassure moins qu'il n'inquiète.
**Fix :** soit nommer l'opérateur (« opérée sur place par [Nom], agence licenciée à Cat Ba ») — vrai badge de confiance — soit ajuster la mention pour refléter le circuit réel. Décision à toi (voir § Décisions).

### 10. Fin de page : deux CTA identiques empilés
Le bloc prix #3 (bouton rouge) est immédiatement suivi de la petite section or « Inscriptions ouvertes » (bouton or) → deux « RÉSERVER MA PLACE » collés, trois familles de boutons (or héro / rouge prix / or final) pour la même action.
**Fix :** fusionner la section or dans le bloc prix #3 (ses deux lignes de texte passent sous le bouton rouge) et **unifier la couleur de CTA** (recommandé : le rouge terracotta partout ; l'or devient secondaire). Note : les 2 boutons rouges du milieu de page pointent vers cette section (`#liste-dattente`) — les repointer vers `/inscription-dws/`.

---

## 📋 Détail par zone (page retraite)

### Héro
- **Accroche 100 % descriptive, zéro promesse** (CRO). Une page world-class vend la transformation. Proposition : titre « **Grimpe sans corde au-dessus des eaux turquoise de la baie d'Halong** », sous-titre « 6 jours / 5 nuits de deep water solo, d'escalade et de vie sur l'eau — en français, max 9 grimpeurs. 19–24 octobre 2026. »
- « Date : 19 octobre 2026 » → « **19–24 octobre 2026** ».
- « Opérée localement avec notre partenaire agréé » : calque de l'anglais + sujet ambigu → « Retraite organisée sur place avec notre partenaire local agréé » (ou déplacer/naming, cf. Top 9).
- Photo : le grimpeur est minuscule et à moitié caché par le bouton. Le 1er écran doit faire dire « je veux faire ÇA » (grimpeur net au-dessus de l'eau, ou en plein saut).
- Sous-texte gris 14 px peu lisible sur photo → 16 px blanc + text-shadow.

### Le manque n°1 de toute la page : **une vidéo**
Le DWS est l'activité la plus cinégénique de l'escalade et la page n'a aucune vidéo du moment signature (lâcher → chute → éclaboussure → rires). 30–60 s en autoplay muet sous le héro = probablement le plus fort ROI de toute cette revue. À défaut : séquence de 3 photos « grimpe / chute / sortie de l'eau ».

### Témoignages (fond excellent, forme à niveau)
- Carrousel qui **cache 4 témoignages sur 7** → grille statique, les 3 plus émotionnels en tête (Kamil, Fiona, Corina).
- **5 sur 7 créditent d'autres guides** (Ursula, Josh, Hung, Trang) — mets en premier ceux qui ne citent que Max ; ajoute prénom + ville/pays et une vraie photo par personne (tu as les photos de sorties). Gras éditorial sur la phrase-clé (« Je vais m'en souvenir toute ma vie »).
- Coquilles à corriger : « Nous avons **joins** » → « Nous avons rejoint » (Ben & Sarah) ; guillemets manquants (Claire) ; titre de Corina fusionné dans la citation ; espace orpheline chez Fiona.
- Titre de section aligné à gauche alors que tout le reste est centré ; flèches de carrousel orphelines.

### Itinéraire & exemple de journée
- **Registre des repas incohérent pour le public QC** : « Déjeuner » 7 h 30 (usage QC ✓) mais « **Dîner** avec le groupe » à 19 h (usage France) → « **Souper** avec le groupe », « souper ensemble » (J1), « souper de clôture » (J5).
- Typo horaires : « 7 h 30 – 8 h 30 » plutôt que « 7h30-8h30 » (norme QC) ; trou 16 h → 17 h non expliqué (mineur).
- Les **marées** sont citées 3× sans être expliquées → une phrase les transforme en preuve d'expertise : « En DWS, la marée décide des secteurs sûrs (il faut assez d'eau sous les voies) — c'est pour ça que l'ordre des journées reste flexible. »

### Blocs prix (×3)
- Ajouter sous le prix : « **Après le 8 septembre 2026 : 3 995 CAD.** » (le prix barré n'est jamais verbalisé).
- Clarifier : « ou 3 versements de 1 240 CAD — **ton dépôt compte comme le premier** » (sinon on peut lire 1 240 + 3×1 240).
- Préciser que réserver early bird **verrouille le tarif** même si les versements 2-3 tombent après le 8 septembre.
- Le 1er bloc prix arrive AVANT le stack de valeur (Inclus) → soit le déplacer après, soit résumer la valeur dans le bloc (« 5 nuits + repas + bateau + 3-5 sessions guidées + kayak + encadrement — tout inclus sur place »).
- Ancrage : « Organisé par toi-même (bateau, guide, hébergement, repas), tu dépasses ce prix — sans l'encadrement ni le groupe. Ici : ~620 $/jour tout compris une fois au Vietnam. »
- UI : 3 blocs identiques = effet copier-coller ; différencier le dernier (badge places restantes / rappel dépôt).

### « Votre hôte » (le maillon faible de l'autorité)
- **Vouvoiement** (« Votre hôte », « pour vous donner accès ») sur une page qui tutoie → « Ton hôte », « pour te donner accès ».
- Zéro fait vérifiable : ajouter chiffres (« X saisons dans la baie · X sorties DWS encadrées · formation [X] ») + 1-2 phrases à la première personne (« J'ai passé X saisons sur ces falaises. Je connais chaque secteur, chaque marée. ») + photo de Max **en train de guider** plutôt qu'un portrait.
- Tuiles photos : légendes blanches illisibles sur images claires (scrim ou légendes sous les tuiles) ; « des repas vietnamien**s** » ; « Couchers de soleil~~s~~ » ; uniformiser les formes (« Exploration… », « Visite… » plutôt que mélange impératifs/noms).

### « Ça fonctionne, même si… » (meilleure section — 2 ajouts)
- L'objection n°1 du DWS manque : **la peur/sécurité**. Ajouter : « …tu as peur de la hauteur ou de tomber — Les voies commencent à 3-4 m au-dessus d'une eau profonde vérifiée, un bateau te récupère à chaque descente, et tu ne montes jamais plus haut que ce que tu choisis. Personne ne te pousse. »
- « …tu crains une semaine de pluie — La baie offre des secteurs abrités et Cat Ba grimpe aussi sur terre ; l'itinéraire s'adapte chaque jour. »
- Ancrer les stats dans le vrai : « La moitié des gens **qui grimpent avec Max dans la baie** viennent de la salle » (1ʳᵉ édition oblige).

### FAQ (existe et fonctionne — 6 questions logistiques manquantes)
Vols/aéroport · **Visa Vietnam** (e-visa obligatoire pour les Canadiens, passeport valide 6 mois — angle mort qui génère des courriels paniqués) · « **Et si je dois annuler ?** » (lien vers la politique) · Hébergement (bateau ou lodge ? chambre partagée ? option couple ?) · Plan B météo/typhon · **Groupe minimum pour que ça parte** (cf. Décisions). Aussi : il faut **savoir nager** — nulle part exigé explicitement pour une activité où l'eau EST la protection (ajouter aux prérequis).

### Clôture
- « La plupart des participants ont vu **cette page**… » : factuellement impossible (1ʳᵉ édition — les témoins ont fait des sorties à la journée). Rendre vrai sans perdre l'effet : « Presque tous ceux qui ont fini par grimper avec Max dans la baie ont hésité avant de dire oui. »

---

## 📋 Détail funnel

### Formulaire `/inscription-dws/` (déjà très bon — robustesse à finir)
Outre le Top 8 : options **radio inaccessibles au clavier/lecteur d'écran** (div → button role=radio) · téléphone sans indicatif pays (« +1 514… » placeholder + hint « c'est là qu'on te rappelle ») · **ville/pays de départ manquant** (fuseau horaire pour l'appel + conseils vols — un champ de plus sur l'écran coordonnées) · pas d'`autocomplete` sur les champs (mobile pré-remplirait tout) · valeurs réinjectées sans échappement (un guillemet dans un nom casse le champ au retour) · toggle FR/EN en cours de route mélange les langues dans les données · V11 apparaît dans deux options de bloc (D et E → E devient « V12 / 8A+ ou plus ») · hint « Entrée ↵ » faux sur les textareas (c'est Ctrl+Entrée) · « Courriel invalide » quand il est juste vide · pas de ligne de confidentialité avant Envoyer (Loi 25 : « on utilise ces infos uniquement pour te recontacter » + lien politique) · pas de copie courriel au candidat (activer `_replyto` Formspree) + « Enregistre mon numéro pour reconnaître mon appel » · erreurs réseau qui s'empilent · pas d'auto-avance JJ→MM→AAAA · 🪂 emoji parachute à côté du sujet · titre « Inscription » vs corps « candidature » (uniformiser sur candidature — « inscription » sur-promet) · limite Formspree : 50 envois/mois (surveiller).
**À ne PAS ajouter maintenant :** contact d'urgence, passeport, allergies détaillées → formulaire logistique APRÈS le dépôt.

### Réservation `/reservation-dws/`
« Suite à ton appel » → « **Après** ton appel » · le dépôt-= 1ᵉʳ-versement doit être dit ICI (« Dépôt = 1ᵉʳ de 3 versements de 1 240 CAD ») au lieu du confus « Tu préfères 3 versements ? » · bouton Interac : « −50 $ » sans condition alors que ça exige le TOTAL par Interac (préciser sur le bouton) et hiérarchie inversée (l'option la plus avantageuse est le bouton le plus faible) · **prévoir la bascule du 8 septembre** (Stripe/PayPal/textes à 1 400) — rappel calendrier · ajouter un bloc « **Après ton dépôt** » : reçu sous 24 h, guide de préparation (visa, vols, assurance, équipement, transfert), groupe WhatsApp de la cohorte · échéancier des versements 2-3 avec dates (cf. Top 2).

### Interac `/interac-dws/`
Numéro « 438-345-1888 » vs « +1 438 345 1888 » ailleurs (uniformiser) · bouton **« Copier le numéro »** (le vrai geste de l'utilisateur) · préciser la fenêtre : « Ta place est verrouillée dès l'envoi du virement (dans ta fenêtre de 48 h) ; confirmation courriel < 24 h » · condition du −50 $ : « si tout ton paiement (dépôt + solde) passe par Interac — déduit du dernier versement ».

### Version EN (bonne traduction, trahie par les conventions)
Nombres à la française en EN : « 3 720 CAD » → « **3,720 CAD** » (3 blocs prix), « 1 240 » → « 1,240 », « save 50 $ » → « **save $50** » (×4) · horaires « 7h30 » → « 7:30 AM » (tableau journée) · guillemets « » → “ ” (témoignages) · **bloc objection absurde en EN** : « …you don't speak English / The retreat is run in French » → « …you don't speak **French** — The retreat runs primarily in French, but Maxime and the local guides also speak English; you'll be fully included. » · « What to Bring: International flight » (on n'« apporte » pas un vol) → « Not Included » · « Registrations are open » → « Registration is open » · spot/place incohérents (« secures your **spot** ») · « Halong Bay » vs « Ha Long Bay » vs « Ha Long » (choisir une graphie éditoriale) · « A question? » → « Questions? » · bio de Max calquée (« conditions management ») → « reading the conditions, caring for the group ».

### Typographie FR (une passe uniforme)
Montants : « 1240 CAD » → « 1 240 CAD » partout (bloc final retraite + toute la politique) · espace avant « : » manquante ×2 (intro) · « 100% » → « 100 % » (politique) · guillemets “ ” → « » (politique) · « slide 5 to 7 of 7 » en anglais dans le carrousel FR · « évènement » (merci) vs « événements » (politique) — choisir.

### Technique / performance (audit fait à la main)
- **Logo = 1,6 MB** (PNG 1024px pour un affichage ~100px !) → export 200px WebP : ~10 KB. · Avatars témoignages 500 KB + 392 KB → ~30 KB chacun. Total images de la page ~3 MB → cible < 1 MB (mobile 4G Vietnam-curious 😉).
- JS Mailchimp mort + CSS `.dws-steps/.dws-pb-note/jkit-mailchimp` orphelins (ménage, aucun impact).
- Animations d'entrée Elementor (`elementor-invisible`, 10 éléments) : si le JS Elementor échoue, la FAQ reste invisible. Vérifie une fois sur ton téléphone que la FAQ apparaît bien en scrollant ; si jamais tu vois un grand blanc avant la FAQ, dis-le-moi (fix = 1 ligne).
- Analytics : chaîne complète OK (`generate_lead` au submit ✓, `begin_checkout` par rail ✓, `purchase` 1 240 sur `?paid=1` ✓). JSON-LD prix/dates cohérents ✓.

---

## ⚡ Quick wins (≈1 h de travail, gros impact)
1. Corriger le solde de la politique (Top 2) + « joins » + « vietnamiens » + « soleil » + espaces « 1 240 ».
2. Supprimer « La liste finale sera confirmée avant l'ouverture officielle » + « selon la formule finale ».
3. « 19–24 octobre 2026 » dans le héro + FAQ dates.
4. Assurance « obligatoire » harmonisée (3 pages).
5. « Votre hôte » → « Ton hôte » (+ « te donner accès »).
6. FAQ langue + FAQ programme dévestigées.
7. EN : « you don't speak French » + « 3,720 » + « save $50 ».
8. Fusionner la section or finale dans le bloc prix #3.
9. Logo 1,6 MB → WebP.
10. Souper/dîner (registre QC).

## 🤔 Décisions qui t'appartiennent (je ne les prends pas pour toi)
1. **Nommer l'opérateur local ?** (badge de confiance massif vs pas encore d'entente signée — c'est toi qui sais où en est l'entente)
2. **Départ garanti ou seuil minimum ?** Si seuil : « départ confirmé à partir de X inscrits, confirmation finale le [date] — attends ce courriel avant d'acheter ton vol. »
3. **Dates limites des versements 2-3 et du solde** (suggestion : V2 = 19 août, solde = 19 septembre, 30 jours avant départ).
4. **Hébergement précis** (bateau ? lodge ? partagé ? option couple ?) — à afficher avec 2-3 photos.
5. **Vidéo héro** : as-tu des rushes des sorties passées ? (le plus fort ROI de la liste)
6. **Réexpliquer le flux candidature→appel→dépôt près des CTA ?** Tu as retiré la section 3 étapes (choix respecté — la FAQ l'explique). La version minimale qui ne « re-charge » pas la page : une microcopie sous chaque bouton — « Candidature 2 min · appel sans engagement ». À toi de voir.

## 🗑️ Écartés (faux positifs de mes captures — par transparence)
- « Case de consentement pré-cochée » → mon script l'avait cochée pour la capture ; la vraie page est décochée avec boutons verrouillés ✓.
- « Écran de confirmation absent en EN » → il existe dans le code (ma capture EN n'avait pas soumis) ✓.
- « FAQ absente / vide de 2500 px avant la fin » → artefact des animations d'entrée en headless ; la FAQ s'affiche au scroll sur le vrai site (tu l'as toi-même citée) ✓ — garder juste l'œil (cf. Technique).
