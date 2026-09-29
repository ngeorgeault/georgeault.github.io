---
title: "Je me suis trompé sur Power Automate"
description: "Agents et automatisations ne se remplacent pas : ils ont des rôles différents et doivent aussi être gouvernés différemment."
publishedAt: 2026-09-22
author: "Nicolas Georgeault"
categories: ["Article"]
tags: ["Power Automate", "Agents", "Gouvernance", "Power Platform"]
legacyUrl: "/je-me-suis-trompe-sur-power-automate/"
sourceUrl: "https://georgeault.net/je-me-suis-trompe-sur-power-automate/"
okfSource: "knowledge/okf/articles/power-automate-agents.md"
migrationStatus: "sample"
---

Pendant un temps, j’ai regardé les agents comme la prochaine étape logique de l’automatisation. C’était une erreur de perspective.

## Deux responsabilités différentes

Un agent interprète, raisonne, choisit et orchestre. Une automatisation exécute un processus déterminé de manière prévisible. Les deux peuvent collaborer, mais les confondre crée rapidement des architectures difficiles à exploiter et encore plus difficiles à gouverner.

## Power Automate reste un moteur d’automatisation

L’arrivée des agents ne supprime donc pas Power Automate. Elle rend au contraire plus importante la distinction entre la couche conversationnelle ou agentique et la couche d’exécution.

Le modèle OKF de ce POC isole précisément cette idée réutilisable du texte éditorial publié.
