# Launch-day checklist — DWS retreat funnel

Print this. Work top to bottom. Nothing here needs code from Claude except the
sold-out flip (§4) and any copy tweaks.

---

## 0 · Before you send ANY traffic (do these first)

- [ ] **Stripe** in **Live** mode, deposit link = 1 065 CAD (early payment discount; bump to 1 165 after Oct 26, 2026), **success URL = `/reservation-dws/?paid=1`**, receipts ON
- [ ] **Stripe test:** pay 1 065 CAD to yourself with a real card → confirm it lands → confirm you land on `/reservation-dws/?paid=1` → **refund it**
- [ ] **PayPal test:** send yourself 1 CAD via `paypal.me/CoreAlivenessProject` → confirm it lands in the `hello@` account
- [ ] **Interac test:** e-transfer $1 to **438-345-1888** → confirm **autodeposit** (no security question) and it lands
- [ ] **Formspree test:** submit the application form once → confirm the email arrives at `hello@corealivenessproject.com` with every answer
- [ ] **Google Ads:** after the Stripe test, confirm the **Purchase** conversion shows activity
- [ ] Open `/inscription-dws/`, `/reservation-dws/`, `/interac-dws/` on **mobile + desktop**, **FR + EN**
- [ ] Walk the whole flow once: retreat page CTA → form → reservation → each pay button

## 1 · When the first application lands (Formspree email)

- [ ] Read: climbing level, **water comfort (swim + jump)**, motivation
- [ ] Judge fit vs the bar (~6a top-rope / V2–V3 + comfortable in open water)
- [ ] Log it in the **Lead Tracker** sheet → shows on the DWS Launch Cockpit · status **New**
- [ ] **Fit** → send the acceptance + deposit email (`email-templates.md` #1), set the **48 h hold**. Offer the **fondateur 3 195** rate to the waitlist / first ~4.
- [ ] **Not a fit** → decline kindly (`decline-script.md`)
- [ ] Cockpit status: **New → Held (48 h)**

## 2 · When a deposit arrives

- [ ] Match it to the applicant (Stripe email / PayPal / **Interac memo = name**)
- [ ] Cockpit: **Held → Confirmed**, log it in the **Payment** column
- [ ] Send the confirmation email (`email-templates.md` #3)
- [ ] Tick one more toward **9**

## 3 · Daily watch (5 min)

- [ ] Formspree inbox (new applications)
- [ ] The 3 money channels: Stripe dashboard · PayPal · bank (Interac)
- [ ] Cockpit "N leads" + **spots left = 9 − confirmed**
- [ ] Nudge holds expiring (~36 h) → `email-templates.md` #4

## 4 · When you hit 9 confirmed deposits

- [ ] Flip the retreat page + form to **COMPLET / SOLD OUT** (ask Claude — quick change)
- [ ] Move extra applicants to a **waitlist** (`decline-script.md` #2)
- [ ] Retire the fondateur rate if still shown anywhere

## 5 · Before the trip (not launch-day, but don't forget)

- [ ] **Lawyer** review of the waiver / refund / insurance drafts before the first balance is due
- [ ] **Accountant:** confirm GST/QST treatment for a Vietnam-delivered service
- [ ] Collect **signed waiver + proof of insurance** (extreme-sports + repatriation) from each confirmed participant ≥ 30 days before departure
- [ ] Confirm your **3 495** price is built on the local operator's **VAT-inclusive** (20 %) quote

---

### The three states (so "are we full?" is never a guess)
**Candidature reçue** (applied) → **Place réservée 48 h** (accepted, holding) → **Place confirmée** (deposit in). Only *confirmée* counts toward 9.
