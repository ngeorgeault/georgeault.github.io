# georgeault.github.io — Astro + OKF dry-run

Ce dépôt sert de **simulation isolée** pour tester une migration de <https://georgeault.net/> de WordPress vers Astro + OKF.

## Portée de ce POC

- 5 articles récents seulement
- conservation des slugs historiques WordPress
- rendu statique Astro
- séparation entre contenu publié et connaissance OKF
- validation automatique du build dans GitHub Actions
- **aucune modification de georgeault.net**
- **aucun changement DNS**
- **aucune bascule de production**

## Articles simulés

1. Et si nous confondions l’œuvre, l’auteur et l’outil ? — 27 septembre 2026
2. Je me suis trompé sur Power Automate — 22 septembre 2026
3. L’audit : la fondation de toute transformation — 16 septembre 2026
4. Votre IA écrit comme une IA ? — 8 septembre 2026
5. Enterprise Brain : après la connaissance, il faudra mesurer l’intelligence de l’organisation — 19 août 2026

## Important sur le contenu

Le POC valide d’abord l’architecture et le processus de migration. Les corps des cinq articles sont volontairement abrégés ; ils ne prétendent pas constituer l’export intégral du WordPress. Une migration réelle utiliserait un export WordPress/API en lecture seule afin de préserver le texte complet, les images, les légendes, les métadonnées SEO et les liens internes.

## Organisation

```text
src/content/articles/      publications rendues par Astro
knowledge/okf/articles/    concepts structurés reliés aux publications
src/pages/                 routes Astro
src/layouts/               gabarits
.github/workflows/         validation du build
```

Chaque publication contient un `legacyUrl` qui devient sa route Astro et un `okfSource` qui pointe vers la connaissance structurée correspondante.

## Développement local

```bash
corepack enable
pnpm install
pnpm dev
```

Validation :

```bash
pnpm build
```
