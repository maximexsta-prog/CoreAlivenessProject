# Email templates — DWS funnel

Ready-to-send templates for the apply → accept → deposit → confirm flow.
Replace `[Prénom]` and the `{{ }}` placeholders. No "désinscrire" line — these
are reservation emails, not newsletter.

---

## 1. Acceptance + deposit (STANDARD rate — 3 995 CAD)

**Objet : Ta place pour le Vietnam**

Salut [Prénom],

Content de te voir embarquer dans la retraite DWS et escalade dans la baie de Lan Ha, le **19 octobre 2026**.

Voici les détails :
5 jours dans la région de Cat Ba / baie de Lan Ha, en petit groupe (max 9). Deep water solo, escalade sportive, kayak, bateau et temps sur l'eau. Le prix est de **3 995 CAD** par personne.

**Ta place est réservée à ton nom pendant 48 h.** Elle se confirme dès réception du **dépôt de 1 400 CAD** (le solde de 2 595 CAD est payable avant le départ). Les places sont limitées et confirmées dans l'ordre des dépôts reçus — passé 48 h, la place est offerte à la personne suivante sur la liste.

Trois façons de régler le dépôt :
- **Carte (Stripe)** : {{stripe_link}}
- **PayPal** : {{paypal_link}}
- **Interac** (Canada, sans frais — économise 100 $ sur le total en payant par Interac) : envoie au **438-345-1888**, avec ton **nom complet en mémo**.

Tu peux payer en entier (3 995 CAD) ou en **3 versements de 1 400 CAD** (le dépôt étant le premier). Réponds-moi si tu préfères les versements et je t'organise ça.

Une dernière chose avant le départ : une assurance voyage couvrant les sports extrêmes et le rapatriement est obligatoire (détails à suivre).

À très bientôt,
Maxime
Core Aliveness Project — corealivenessproject.com

---

## 2. Acceptance + deposit (FONDATEUR rate — 3 720 CAD, for the waitlist / first spots)

*Same as above, with this paragraph swapped in:*

> Comme tu étais parmi les premières personnes intéressées, je te réserve le **tarif fondateur : 3 720 CAD** (au lieu de 3 995). **Ta place est réservée 48 h** ; elle se confirme avec le **dépôt de 1 400 CAD** (solde de 2 320 CAD avant le départ), ou en **3 versements de 1 240 CAD**. Ce tarif est limité aux toutes premières réservations.

---

## 3. Deposit received → confirmation

**Objet : C'est officiel — ta place est confirmée 🧗**

Salut [Prénom],

Dépôt bien reçu — **ta place est confirmée** pour la retraite DWS, 19 octobre 2026. Bienvenue dans le groupe !

Prochaines étapes (je t'écris d'ici peu avec les détails) :
- Solde de {{2 595 / 2 320}} CAD à régler avant le **[date]**.
- Preuve d'assurance (sports extrêmes + rapatriement) au moins 30 jours avant le départ.
- Décharge de responsabilité à signer.
- Infos pratiques : vols suggérés, logistique d'arrivée à Cat Ba, matériel à prévoir.

Des questions d'ici là ? Réponds ici ou WhatsApp +1 438 345 1888.

À bientôt sur le rocher,
Maxime
Core Aliveness Project — corealivenessproject.com

---

## 4. Gentle nudge (hold expiring — send ~36 h after acceptance if no deposit)

**Objet : Ta place est encore là — jusqu'à demain**

Salut [Prénom],

Petit rappel amical : je garde ta place pour la retraite DWS encore **~12 h**. Après, je la propose à la personne suivante sur la liste.

Si tu es partant·e, le dépôt de 1 400 CAD la verrouille : {{stripe_link}} · PayPal {{paypal_link}} · Interac au 438-345-1888 (mémo = ton nom).

Un doute ou une question ? Réponds-moi, on en parle.

Maxime
Core Aliveness Project
