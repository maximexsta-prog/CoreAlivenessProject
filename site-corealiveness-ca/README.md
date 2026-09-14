# corealiveness.ca

Site web de Maxime X. St-Arnault. Une seule page, statique, bilingue FR/EN.

## Architecture

| Domaine | Ce qu'il sert |
|---|---|
| `corealiveness.ca` | Ce depot. La page principale. |
| `corealivenessproject.com` | L'autre depot. La page de la retraite DWS et son tunnel d'inscription. |
| `maximestarnault.com` | Redirige vers `corealiveness.ca`. |

Les liens vers la retraite pointent vers
`https://corealivenessproject.com/retraite-dws-nov-2026/?lang=en`.

## Contenu du depot

```
index.html        toute la page : HTML, CSS et JS dans un seul fichier
img/              les quatre photos
_redirects        raccourcis /dws /retraite /retreat /en /fr  (Netlify)
_headers          cache des images et en-tetes de securite    (Netlify)
robots.txt
sitemap.xml
```

Aucune dependance, aucune etape de compilation. On ouvre `index.html` et ca marche.

## Travailler dessus

Pour voir la page en local :

```bash
python3 -m http.server 8899
# puis http://localhost:8899/
```

Verifier avant de pousser :

- les deux langues, avec `?lang=fr` et `?lang=en`
- la largeur a 1280 px et a 390 px, sans debordement horizontal
- les quatre images qui chargent
- la console, qui liste les cles de traduction manquantes

## Le bilingue

Le francais vit dans le HTML. C'est la source.

Chaque bout de texte traduisible porte un attribut :

- `data-i18n="cle"` pour du texte simple
- `data-i18n-html="cle"` quand le texte contient des balises
- `data-i18n-attr="cle"` pour un `placeholder` ou un `content` de meta

L'anglais vit dans l'objet `DICT.en` en bas du fichier. Une cle absente laisse
le francais en place et ecrit un avertissement dans la console, donc rien ne
casse jamais.

Deux pieges :

- Dans `DICT.en`, ecrire les vrais caracteres (`·`, `→`) et pas les entites
  HTML (`&middot;`, `&rarr;`). Les entites passent en texte brut a travers
  `textContent`.
- Ajouter une cle des deux cotes, sinon la page reste en francais en mode EN
  et personne ne le remarque.

## Deploiement

Netlify, depuis la branche `main`. Un fichier sur une autre branche renvoie 404
tant qu'il n'est pas fusionne.
