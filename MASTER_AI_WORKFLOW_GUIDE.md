# Guide Ultime du Workflow IA : De l'Idée à l'Excellence "Awwwards"

Ce guide documente la méthodologie exacte (le "secret sauce") utilisée pour transformer une simple idée en une plateforme web de très haute qualité, du niveau des agences primées. Ce document est conçu pour être fourni comme **contexte initial** à une IA (comme Claude ou Gemini) au démarrage de tout nouveau projet, afin de lui imposer un standard d'excellence et une marche à suivre stricte.

---

## 🛑 Phase 1 : La Recherche et l'Ancrage (NotebookLM)
*Ne jamais commencer à coder sans avoir défini "l'âme" du projet.*

Avant d'écrire la moindre ligne de code ou de dessiner un bouton, l'IA doit comprendre profondément le sujet.

1.  **Création du Cerveau (NotebookLM)** :
    *   **Action** : Utiliser l'intégration NotebookLM (via le MCP/Skill) pour créer un nouveau carnet dédié au projet.
    *   **Ingestion** : Alimenter NotebookLM avec tous les documents bruts disponibles : manifestes de l'entreprise, vieux PDF, descriptions de la cible, liens vers des sites concurrents, vidéos YouTube d'interviews des fondateurs.
2.  **Extraction de l'Essence** :
    *   **Prompt IA** : *"Agis comme un directeur de marque. Analyse les sources dans NotebookLM et génère un résumé stratégique : Quelle est la mission profonde ? Quels sont les 3 archétypes de la marque ? Quel est le ton de voix exact (avec exemples de ce qu'il faut faire et ne pas faire) ?"*
3.  **Traduction Visuelle (Visual Word Translation)** :
    *   **Prompt IA** : *"En te basant sur la stratégie définie, traduis ces concepts abstraits en directives visuelles. Quelles couleurs représentent ces valeurs ? Quel style typographique ? (ex: sérif classique pour l'autorité, sans-sérif géométrique pour l'innovation)."*

---

## 🎨 Phase 2 : Le Design System & La Maquette Conceptuelle
*Structurer les fondations visuelles avant d'assembler les pages.*

L'IA doit agir comme un `ui-ux-expert` et un directeur artistique (`visual-identity-direction`).

1.  **Rédaction du Manifeste Visuel** :
    *   **Action** : Créer un fichier `brand_identity_guidelines.md` (ou `.stitch/DESIGN.md`) à la racine du projet.
    *   **Contenu obligatoire** :
        *   Palette de couleurs HSL/Hex (Principale, Secondaire, Neutres/Backgrounds) avec leur *signification psychologique*.
        *   Typographie (Headings vs Body) avec les tailles de base.
        *   Règles d'espacement (Negative Space) et formes (Border-radius, shadows).
2.  **La "Maquette Mentale" (Wireframing par Prompt)** :
    *   **Prompt IA** : *"Avant de coder, décris-moi l'architecture de la page d'accueil section par section. Comment l'histoire se déroule-t-elle à travers le scroll ? Décris l'intention UX de chaque bloc."*

---

## 🚀 Phase 3 : L'Implémentation Frontend Haute Fidélité
*Coder avec une exigence "Premium" par défaut.*

1.  **Initialisation de la Stack** :
    *   Exemple : Next.js + Tailwind CSS.
    *   **Action IA** : Configuration immédiate des polices globales et intégration des variables de couleurs du Design System dans les fichiers de configuration CSS/Tailwind.
2.  **Génération des Composants (L'approche "Anti-Générique")** :
    *   **Règle absolue pour l'IA** : *Ne JAMAIS utiliser des designs de base (ex: boutons carrés bleus standard). Chaque élément doit avoir une esthétique riche.*
    *   **Prompt IA** : *"Génère la section [Nom]. Applique les principes du Glassmorphism / Bento Grid / Brutalisme (selon le projet). Assure-toi d'utiliser le système de couleurs défini. Le rendu doit être luxueux, moderne et provoquer un effet 'Waouh'. Ajoute des micro-interactions au hover."*

---

## 🎬 Phase 4 : Le Mouvement et l'Émotion (Scrollytelling)
*Un site statique est un site mort.*

1.  **Intégration du Moteur d'Animation** :
    *   Installation de **GSAP**, **ScrollTrigger**, et d'un outil de smooth scroll comme **Lenis**.
2.  **Chorégraphie du Défilement** :
    *   **Prompt IA** : *"Intègre GSAP à ce composant. Je veux que les éléments se révèlent de manière asynchrone (stagger) lorsque l'utilisateur scrolle dans cette zone. Le texte de titre doit apparaître mot par mot (SplitText). L'animation doit être subtile, fluide (buttery smooth) et liée au scroll (scrub)."*

---

## ⚙️ Phase 5 : Fondations Backend & Outils Métiers
*Rendre le beau fonctionnel.*

1.  **Modélisation des Données** :
    *   **Action** : Conception du schéma de base de données (ex: Prisma schema) en fonction des besoins réels (Blog, E-commerce, Dashboard).
2.  **Intégration Systémique** :
    *   Développement des API Routes, connexion à la base de données, mise en place de l'authentification (ex: Better-Auth).
    *   Création de l'Espace d'Administration : *Le back-office doit être aussi bien designé que le front-office.*

---

## ✨ Phase 6 : Le "Polish Pass" (Le Souci du Détail)
*La différence entre un bon site et un site primé se joue dans les 5 derniers pourcents.*

1.  **Invocation de l'Expertise de Finition** :
    *   **Prompt IA** : *"Agis avec la compétence 'polish'. Fais une passe complète sur le fichier X. Vérifie : l'alignement optique, la cohérence des marges (spacing), les contrastes de couleurs pour l'accessibilité (WCAG), et la fluidité responsive sur mobile. Corrige la moindre imperfection visuelle ou de performance."*

---

## 💡 Comment utiliser ce guide pour votre prochain projet ?

Copiez-collez l'introduction suivante à votre IA lors de l'initialisation d'un nouveau projet :

> *"Voici le `MASTER_AI_WORKFLOW_GUIDE`. Tu vas agir comme une agence digitale primée de bout en bout. Nous allons suivre rigoureusement les Phases 1 à 6 de ce guide pour construire mon nouveau projet : [Description de votre projet]. Commence par la Phase 1 : dis-moi ce dont tu as besoin comme documentation pour initialiser notre réflexion stratégique."*
