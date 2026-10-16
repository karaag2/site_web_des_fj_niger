# Guide de Workflow : Excellence Créative & Technique (FJ Style)

Ce document récapitule la méthodologie utilisée pour créer le site **Les Fabricants de Joie**. Il est conçu pour servir de base (contexte ou prompt) pour de futurs projets exigeant un haut niveau de design ("Awwwards-style") et une intégration technique robuste.

---

## 1. Philosophie & ADN du Projet

Le succès visuel repose sur un paradoxe maîtrisé : **L'authenticité humaine mélangée au minimalisme premium.**

- **Concept Central** : Un design "fragmenté" et éditorial qui laisse respirer le contenu tout en utilisant des animations cinématographiques pour guider l'œil.
- **Archétypes** : Un mix entre **l'Innocent** (pureté, joie) et le **Créateur** (innovation, art).
- **Règle d'Or** : Ne jamais sacrifier la lisibilité pour le style, mais ne jamais accepter un design "par défaut" (pas de Tailwind générique, pas de composants UI standards sans personnalisation).

---

## 2. Stack Technique de Référence

Pour obtenir cette fluidité et cette robustesse, la stack suivante a été optimisée :

- **Framework** : `Next.js 16` (App Router) pour la performance et le SEO.
- **Animations** :
  - `GSAP (ScrollTrigger)` : Pour l'expérience de "scrollytelling" (révélation de texte mot par mot, parallaxe).
  - `Lenis` : Pour un défilement fluide (smooth scroll) indispensable au feeling premium.
  - `Framer Motion` : Pour les micro-interactions simples et les transitions d'états.
- **Base de Données & Auth** : `Prisma` + `Better-Auth` pour un système de blog et d'administration sécurisé et typé.
- **Styling** : `Tailwind CSS 4` (utilisé avec parcimonie pour la structure) + `Vanilla CSS` pour les effets complexes (glassmorphism, dégradés animés).

---

## 3. Le Manuel Étape par Étape

### Étape 1 : Direction Artistique & Identité
Avant de coder, définir une palette qui "vibre". 
> **Instruction** : Utiliser des couleurs contrastées mais harmonieuses (ex: Orange Joie #FF7F3F et Bleu Océan #1C3B5E). Choisir des typographies qui ont du caractère mais restent lisibles (ex: `Outfit` pour les titres, `Inter` pour le corps).

### Étape 2 : Architecture du "Scrollytelling"
L'animation ne doit pas être un gadget, elle doit raconter une histoire.
> **Technique** : Implémenter un `ManifestoSection` où le texte se révèle au rythme du scroll. Utiliser `GSAP SplitText` pour animer chaque mot individuellement avec une opacité et un léger décalage Y.

### Étape 3 : Optimisation des Assets
La qualité perçue dépend de la résolution des images.
> **Règle** : Toujours utiliser des images locales optimisées dans `/public/images`. Utiliser des compositions "fragmentées" (grilles irrégulières) pour casser la monotonie du web traditionnel.

### Étape 4 : Système Editorial (Blog & Admin)
Un site vitrine devient puissant quand il est vivant.
> **Structure** : Créer un backend avec Prisma pour gérer les articles et les catégories. L'interface d'administration doit être aussi soignée que le front-end (utilisation de dashboards cleans avec des statistiques visuelles).

---

## 4. Prompts "Gold Standard" pour IA

Utilise ces structures de prompts pour tes futurs projets afin d'obtenir des résultats similaires :

### Pour le Design UI/UX :
> *"Génère un composant React pour une section Hero au style 'Awwwards'. Utilise un layout fragmenté avec des images aux bords arrondis. Le design doit être premium, minimaliste, avec une typographie de grande taille (Outfit). Intègre des micro-animations au survol et utilise un combo de couleurs [Couleur A] et [Couleur B]. Évite le look Bootstrap/générique."*

### Pour les Animations GSAP :
> *"Crée une section de manifeste interactive en Next.js. Utilise GSAP ScrollTrigger pour faire apparaître le texte mot par mot au fur et à mesure que l'utilisateur scrolle. L'animation doit être 'buttery smooth' et liée directement à la progression du scroll (scrub: true). Ajoute un effet de flou (blur) qui s'estompe quand le texte devient actif."*

### Pour la Structure Full-stack :
> *"Configure un schéma Prisma pour un système de blog multi-utilisateurs. Inclus des modèles pour 'Post', 'Category', 'User' (avec rôles admin/superadmin) et 'Comment'. Génère une route API Next.js qui récupère les statistiques globales (nombre de posts, vues totales) pour un Dashboard Admin."*

---

## 5. Checklist de Finalisation (The Polish Pass)

- [ ] Est-ce que le scroll est fluide ? (Lenis activé ?)
- [ ] Les images ont-elles des placeholders ou des transitions de chargement ?
- [ ] La hiérarchie typographique est-elle respectée ? (H1 clair, espacement généreux).
- [ ] Le responsive est-il "pixel-perfect" sur mobile ?
- [ ] L'accessibilité (WCAG) est-elle préservée malgré les animations ?

---
*Fichier généré le 08/04/2026 pour le projet Les Fabricants de Joie.*
