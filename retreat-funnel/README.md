# DWS Retreat — Application → Deposit Funnel (build package)

Everything needed to turn the retreat page's email-only signup into a real
**apply → screen → deposit** funnel. This folder is the source of truth for the
funnel; the live site files are edited separately.

> ⚠️ **Legal note:** the waiver, insurance clause, and cancellation policy in
> this folder are solid working drafts written to be practical and readable —
> **not** a substitute for review by a lawyer licensed in Québec/Canada. Deep
> Water Solo is a high-risk activity delivered in Vietnam by a local operator,
> which crosses jurisdictions. Have a lawyer review before you rely on these.

---

## 1. Final numbers (locked — used everywhere)

| Item | Value |
|---|---|
| **Date** | 19 octobre 2026 (5 jours) |
| **Group cap** | 9 participants (sold out = 9 **deposits**, not 9 applications) |
| **Standard price** | **3 995 CAD** / personne |
| **Deposit** | **1 400 CAD** (confirms the spot) |
| **Balance** | **2 595 CAD** (due before departure) |
| **Fondateur (early) price** | **3 720 CAD** — private early-bird rate (see below) |

**Fondateur rate:** 3 720 CAD is *not* published on the site — it's offered by
email/at acceptance to the current waitlist + the first ~4 deposits, then it
disappears and everyone pays 3 995. This (a) rewards the two people already
quoted 3 720, (b) lets the public price be a clean, premium 3 995, and (c)
creates honest urgency ("tarif fondateur jusqu'à la place #5").

Installment option (offered at acceptance): **3 × 1 400 = 4 200** (deposit is the
first installment; +205 vs paying in full — paying in full at 3 995 is framed as
"économise ~200"). Fondateur installments: 3 × 1 240 = 3 720.

Public surfaces already updated to 3 995 / 1 400 / 2 595 / 19 Oct / max 9:
`retraite-dws-oct-2026/index.html` (body + EN dictionary + both JSON-LD blocks +
Event offer price + capacity), `politique-de-confidentialite/index.html`,
`llms.txt`, `llms-full.txt`. Flyer already shows 19 oct 2026 and no price.

---

## 2. Answers to your four questions

### Q1 — "How do I make the deposit a *requirement*, not just an invitation?"
Use a **time-boxed hold**, not an open invite. Three states, and only the last
one counts toward the 9 seats:

1. **Candidature reçue** — form submitted. Not a spot.
2. **Place réservée (48 h)** — you accept and *hold* the spot in their name for
   **48 hours**. Message: *"Ta place est réservée à ton nom pendant 48 h. Elle
   se confirme dès réception du dépôt de 1 400 CAD. Passé ce délai, elle est
   offerte à la personne suivante sur la liste."*
3. **Place confirmée** — deposit received. Now it counts.

The requirement is enforced by the **deadline + the queue behind them**
("places confirmées dans l'ordre des dépôts reçus"). Nobody is *inscrit* until
the deposit lands — that's correct and standard for expeditions/retreats. The
deposit **is** the enrollment action; the 48 h hold turns "please pay" into "pay
now or lose the spot." Track the state in the cockpit's **Client status** column
(New → Held (48h) → Confirmed → Waitlist).

### Q2 — "How much Interac discount?"
Card fees run ~2.9 % + $0.30 ≈ **$116 on a 3 995 payment** (~$41 on the 1 400
deposit). Interac is free to you. Recommendation: **100 CAD off the total for
full payment by Interac** — roughly fee-neutral for you, a clean nudge to the
free rail, and simple to say: *"Paie par Interac (virement, sans frais) et
économise 100 $."* Don't discount the deposit itself (keep the commitment number
clean); apply the rebate to the balance/total. Note: **Interac is Canada-only** —
international climbers must use Stripe/PayPal, so this is a "Canadians save"
perk, not a universal one.

### Q3 — "Vietnam tax is 20 %."
That 20 % VAT is charged by your **local operator on what they bill you** — it's
a **cost input, not a checkout tax you add to the customer.** You sell an
all-in CAD package from Canada; the customer sees one price (3 995) with no
surprise tax. Action: make sure your 3 995 price is built on the operator's
**VAT-inclusive** quote so the 20 % doesn't eat your margin. Confirm with your
accountant whether your Canadian sale is zero-rated/out-of-scope for GST/QST
(service delivered abroad) — likely, but get it in writing.

### Q4 — "Do you need the Tally API?"
**Not for launch.** To build the form you need nothing from Tally. You'd only
need Tally's **webhook/API** later (v2) if we want responses to flow
automatically into your Google Sheet and appear on the DWS Launch Cockpit. For
the phased plan: build the Tally form now (paste the script in
`tally-application-script.md`), responses live in Tally + email; we wire the
cockpit in v2. So — hold the API for now.

---

## 3. What I still need from you to finish wiring

| Needed | For |
|---|---|
| **Formspree endpoint** (free signup, ~5 min) | Where the application form sends submissions → set `FORMSPREE_ENDPOINT` in `postuler-dws/index.html` |
| **Google Ads `AW-XXXXXXX/label`** | Fix the broken lead conversion + add deposit `Purchase` |
| **Stripe Payment Link** (deposit, 1 400 CAD) | Reservation page button (`{{stripe_link}}`) |
| **PayPal deposit link/button** | Reservation page button (`{{paypal_link}}`) |
| ~~Interac~~ ✅ **438-345-1888** (enable Autodeposit) | wired into reservation page + emails |
| ~~Tally URL~~ ✅ **self-hosted** at `/postuler-dws/` | CTAs already routed here w/ email prefill |

---

## 4. Files in this package

- `tally-application-script.md` — the full FR/EN application flow to paste into Tally
- `legal-liability-waiver.md` — DWS liability waiver + insurance clause + consent text (draft)
- `cancellation-refund-policy.md` — deposit/cancellation terms (FR/EN), aligned to the policy page
- `email-templates.md` — acceptance/deposit + confirmation emails (with fondateur rate)
- `decline-script.md` — kind, safety-framed decline templates

**Live funnel pages (published in repo root):**
- `../postuler-dws/index.html` — self-hosted bilingual application wizard (13-question DWS flow). Set `FORMSPREE_ENDPOINT`; redirects to `/reservation-dws/` on submit. Site CTAs already route here (email prefilled).
- `../reservation-dws/index.html` — reservation/deposit page (Stripe + PayPal + Interac 438-345-1888 + Purchase tracking). Fill `{{stripe_link}}` / `{{paypal_link}}` / Google Ads `send_to`.

## 5. Preflight status (from the launch checklist)

Done ✅: price/date/operator consistency (site, policy, llms), group cap 9,
deposit-requirement model, Interac discount decision, Vietnam-tax clarification,
Tally-API answer, first drafts of waiver/insurance/refund/consent, decline
script, email templates, deposit-page draft.

Pending ⏳ (need your inputs above or an external account): build Tally form,
create Stripe/PayPal links + Interac handle, wire CTAs to Tally, publish deposit
page, fix Google Ads conversion, accountant tax check, lawyer review of legal
drafts, one real test transaction per rail.
