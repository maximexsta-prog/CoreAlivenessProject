# DWS Retreat — Application form script (Tally)

Paste these questions into Tally (tally.so). Modeled on the proven Altitude /
Chris Sharma flow, tuned for Deep Water Solo (adds the two water-safety gates)
and bilingual. Put contact info *after* the engaging questions so applicants are
invested before you ask for phone/email. Keep it ~2–4 minutes.

**Tally setup tips**
- Turn on a **Welcome page** (screen 0 below) and **one-question-per-screen** ("Conversational" layout).
- First real field = **email** so an abandoned application still leaves you a lead. If you pass `?email=` from the site, map it to hidden-prefill this field.
- Enable **email notifications** to hello@corealivenessproject.com on submit.
- Add **required** on: email, name, climbing years, both water-safety gates, DOB, consent.
- For v2 (cockpit sync): add a Tally **webhook** → Apps Script `addLead` (see repo README backend notes). Not needed to launch.

---

## Screen 0 — Welcome / Bienvenue

**FR**
> ### Postule pour la retraite DWS — Baie de Lan Ha, Vietnam · 16 novembre 2026
> Merci de vouloir embarquer dans l'aventure. Quelques questions (~3 min) pour
> apprendre à te connaître et bien te placer dans le groupe (max 9 personnes).
> Ce n'est pas un paiement — c'est une candidature. Je te réponds vite.
>
> **Commencer →**

**EN**
> ### Apply for the DWS retreat — Lan Ha Bay, Vietnam · November 16, 2026
> Thanks for wanting to join. A few questions (~3 min) so I can get to know you
> and place you well in the group (max 9). This isn't a payment — it's an
> application. I reply fast.
>
> **Start →**

---

## Q1 · Depuis combien de temps grimpes-tu ? / How long have you been climbing?
*(Multiple choice — required)*
- 0–1 an / year
- 1–3 ans / years
- 3–5 ans / years
- 5–10 ans / years
- 10+ ans / years

## Q2 · As-tu déjà grimpé dehors ? Déjà fait du Deep Water Solo ? / Have you climbed outdoors? Ever done DWS?
*(Long text — required)*
> Raconte en quelques lignes (où, quel style, à quelle fréquence). Si jamais dehors, écris « non ». / A few lines (where, what style, how often). If never outdoors, write "no".

## Q3 · Ton niveau max en tête / moulinette / Your max grade (lead / top rope)
*(Multiple choice — required. Pas besoin de grimper en tête pour participer — c'est juste pour bien te placer.)*
- 5.10b / 6a ou moins / or lower
- 5.10c–5.11c / 6a+–6c+
- 5.11d–5.13a / 7a–7c+
- 5.13b / 8a ou plus / or higher
- Je ne grimpe pas en tête/moulinette / I don't lead or top rope

## Q4 · Ton niveau max en bloc / Your max grade (bouldering)
*(Multiple choice — required)*
- V3 et moins / and below (6A et moins)
- V4–V6 (6B–7A)
- V7–V8 (7A+–7B+)
- V9–V11 (7C–8A)
- V11 / 8A+ ou plus / or higher
- Je ne fais pas de bloc / I don't boulder

## Q5 · 🌊 À l'aise de nager en mer / eau profonde ? / Comfortable swimming in open / deep water?
*(Multiple choice — required — DWS safety gate)*
- Oui, très à l'aise / Yes, very comfortable
- Ça va, je nage correctement / Okay, I swim fine
- Peu à l'aise, mais je flotte / Not very, but I float
- Non, je ne suis pas à l'aise dans l'eau / No, I'm not comfortable in water

## Q6 · 🪂 À l'aise de sauter d'une hauteur dans l'eau ? / Comfortable jumping from height into water?
*(Multiple choice — required — DWS safety/comfort gate)*
- Oui, j'adore ça / Yes, I love it
- Oui, avec un peu d'appréhension / Yes, with a bit of nerves
- Jamais essayé, mais partant·e / Never tried, but game
- Ça m'inquiète beaucoup / It worries me a lot

## Q7 · Qu'est-ce qui t'attire le plus dans cette aventure ? / What draws you most to this trip?
*(Long text — required — motivation + fit)*
> Quelques lignes suffisent. / A few lines is plenty.

## Q8 · Tes coordonnées / Your contact info
*(Contact fields — required: first name, email; optional: last name; required: phone/WhatsApp)*
- Prénom* / First name*
- Nom / Last name
- Téléphone (WhatsApp)* / Phone (WhatsApp)*
- Courriel* / Email*

## Q9 · Ta date de naissance / Your date of birth
*(Date — required — confirms 18+)*
> Confirme que tu as 18 ans ou plus. / Confirms you're 18+.

## Q10 · Préférence de paiement / Payment preference
*(Multiple choice — required — preference only, no card collected here)*
- Paiement complet — 3 495 CAD / Pay in full — 3,495 CAD
- 3 versements de 1 165 CAD (dépôt + 2 versements) / 3 payments of 1,165 CAD
- J'aimerais discuter d'un arrangement / I'd like to discuss a custom plan

## Q11 · Pour l'attribution des chambres : ton genre / For room assignment: your gender
*(Multiple choice — required)*
- Homme / Male
- Femme / Female
- Non-binaire / Non-binary
- Autre / Other

## Q12 · Comment as-tu entendu parler de la retraite ? / How did you hear about the retreat?
*(Multiple choice — attribution)*
- Instagram (Core Aliveness)
- Publicité Instagram/Facebook / IG-FB ad
- Recherche Google / Google search
- Bouche à oreille / Word of mouth
- YouTube
- Autre / Other

## Q13 · Autre chose à partager ? / Anything else to share?
*(Long text — optional — allergies, questions, custom payment needs, etc.)*

---

## Thank-you / redirect
On submit, redirect to the reservation page (`deposit-page.html` once published,
e.g. `/reservation-dws/`). Tally supports a redirect-on-completion URL. Message
before redirect:

**FR** — *"Candidature reçue ! Je la lis personnellement et je te réponds vite (souvent le jour même). Prochaine étape sur la page suivante."*
**EN** — *"Application received! I read every one personally and reply fast (often same-day). Next step on the following page."*
