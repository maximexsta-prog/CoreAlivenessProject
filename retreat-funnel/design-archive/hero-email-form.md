# 🏷️ ARCHIVE — Hero email-capture form design (v1)

**Retiré le :** 2026-07-12 · **Dernière version live avec ce design :** commit `289603c`
(merge PR #13) · **Tag git :** `hero-email-form-v1` (local — pour le créer sur GitHub : `git tag hero-email-form-v1 289603c && git push origin hero-email-form-v1`)

Le design aimé : pilule blanche avec champ « Votre courriel » + bouton or
« RÉSERVER MA PLACE → » intégré (or `#DA9917`, coins 99px). Présent en 4 exemplaires :
héro desktop (`6c1f92ac`), héro mobile (`f8b246e`), bas desktop (`76ede257`),
bas mobile (`ec7cdd8`) — remplacés par des boutons CTA directs vers `/inscription-dws/`.

## Pour le restaurer

```bash
# tout le fichier tel qu'il était :
git checkout hero-email-form-v1 -- retraite-dws-oct-2026/index.html
# ou consulter : git show 289603c:retraite-dws-oct-2026/index.html
```

Ou repartir du bloc ci-dessous (héro desktop — les 3 autres sont identiques,
seules les classes de visibilité du wrapper changent).

## Comportement d'origine

Le submit était intercepté en JS (toujours présent dans la page, inoffensif) :
inscription Mailchimp best-effort → redirection `/inscription-dws/?email=<courriel>`
(courriel prérempli dans le formulaire de candidature).

## HTML (héro desktop, tel quel)

```html
<div class="elementor-element elementor-element-6c1f92ac elementor-widget-tablet__width-inherit elementor-widget__width-inherit elementor-widget-mobile__width-initial dws-email-form elementor-hidden-mobile elementor-widget elementor-widget-jkit_mailchimp" data-id="6c1f92ac" data-element_type="widget" data-e-type="widget" data-widget_type="jkit_mailchimp.default">
<div class="elementor-widget-container">
	<div class="jeg-elementor-kit jkit-mailchimp style-inline jeg_module_46__6a2370226389e"><form action="https://corealivenessproject.us1.list-manage.com/subscribe/post?u=3c0ff8a8671173635efa43a3e&amp;id=15cf5c91f1&amp;f_id=001c85e5f0" method="post" target="_blank" class="jkit-mailchimp-form">
        <div class="jkit-mailchimp-message"></div>
        <div class="jkit-form-wrapper email-form">
            <div class="jkit-mailchimp-email jkit-input-wrapper input-container">
        <div class="jkit-form-group">
            <div class="jkit-input-element-container jkit-input-group">
                <input type="email" name="EMAIL" class="jkit-email jkit-form-control " placeholder="Votre courriel" required="">
            </div>
        </div>
    </div><div class="jkit-submit-input-holder jkit-input-wrapper">
        <button type="submit" class="jkit-mailchimp-submit position-after" name="jkit-mailchimp">
            RÉSERVER MA PLACE<i aria-hidden="true" class="icon icon-right-arrow"></i>
        </button>
    </div>
        </div>
        <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_3c0ff8a8671173635efa43a3e_15cf5c91f1" tabindex="-1" value=""></div>
    </form></div>				</div>
</div>
```

Le CSS du look (pilule, bouton intégré, or `#DA9917`) vit dans les styles jkit-mailchimp
du `<style>` principal de la page (cherche `jkit-mailchimp` et `dws-email-form`) —
toujours présent dans le fichier, non supprimé.
