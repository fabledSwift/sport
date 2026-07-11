# Transfo — Mattéo 💪

App web de suivi de transformation physique (juillet → septembre 2026) : +6 kg de muscle en 2 mois, avec barre de traction et station de dips uniquement.

Fonctionne 100 % en local (localStorage + IndexedDB pour les photos), avec **synchronisation cloud optionnelle** via un dépôt GitHub privé pour retrouver ses données sur tous ses appareils. Installable comme une vraie app sur iPhone (PWA).

## Lancer sur ce PC

Double-clique sur **`Lancer Transfo.cmd`** — c'est tout.

(ou en ligne de commande : `npm install` puis `npm run dev`)

## 🌍 Mettre l'app en ligne — guide 5 minutes

Tout est déjà prêt (dépôt git + déploiement automatique). Il ne manque que ton compte GitHub :

1. **Crée un compte** sur [github.com](https://github.com) (gratuit) si tu n'en as pas
2. **Installe [GitHub Desktop](https://desktop.github.com)** et connecte-toi dedans
3. Dans GitHub Desktop : **File → Add local repository** → choisis le dossier `Desktop\sport`
4. Clique **Publish repository** → nom : `transfo` → décoche « Keep this code private » (le code peut être public, tes données n'y sont pas) → Publish
5. Sur github.com, ouvre ton dépôt `transfo` → **Settings → Pages → Source : « GitHub Actions »**

≈ 2 minutes plus tard, ton app est en ligne pour toujours sur :
**`https://TON-PSEUDO.github.io/transfo/`**

Ensuite sur iPhone : ouvre cette adresse dans **Safari → Partager → Sur l'écran d'accueil**. Chaque fois que tu modifies le code et fais « Push » dans GitHub Desktop, le site se met à jour tout seul.

## ☁️ Compte & synchronisation (données présentes 24h/24)

Tes résultats sont sauvegardés dans un dépôt GitHub **privé** (seul toi peux le voir) et se synchronisent automatiquement entre ton PC et ton iPhone :

1. Sur github.com : **New repository** → nom : `transfo-data` → **Private** → Create
2. Va sur [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new) → nom « transfo », expiration 1 an → **Only select repositories** → `transfo-data` → Permissions → **Contents : Read and write** → Generate token → copie-le
3. Dans l'app : **Stats → Compte & Sync → Connecter** → colle `ton-pseudo/transfo-data` + le token

À faire une fois par appareil. Ensuite : synchro automatique au lancement et ~45 s après chaque modification (pesées, séances, repas, photos incluses). Le token expire au bout d'un an — GitHub t'enverra un mail, il suffira d'en régénérer un.

## Fonctionnalités

- **Dashboard** — poids vs objectif (83 kg), J-restants, streak, calories cochées, eau, sommeil, séance du jour, rappel photo
- **Suivi du poids** — saisie quotidienne, moyenne mobile 7 j, projection au 15 septembre, alertes si prise < 0,5 ou > 1 kg/semaine
- **Photos** — face/profil/dos quotidiennes (compressées, stockées en local, synchronisées), galerie, comparaison avant/après avec slider
- **Entraînement** — Push/Pull/Legs ×2 par semaine, progression automatique par niveaux (reps → tempo → variantes → lest au sac à dos), timer de repos, historique et records par exercice
- **Nutrition** — ≈3 200 kcal / 145 g de protéines par jour, **4 semaines de menus en rotation** (28 journées différentes), bouton 🔄 pour remplacer n'importe quel repas, liste de courses agrégée, meal prep du dimanche avec quantités calculées, checklist des 5 repas du jour
- **Hydratation & sommeil** — 3 L/jour visés (boulot au soleil), historique 7 jours
- **Stats & badges** — records perso, résumé hebdo, 19 badges, compte & sync, réglages, sauvegarde/restauration JSON

## Stack

React 19 + Vite 7 · Tailwind CSS 4 · Recharts · lucide-react · vite-plugin-pwa · GitHub API (sync) · GitHub Actions + Pages (hébergement)
