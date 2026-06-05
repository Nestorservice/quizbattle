# QuizBattle

Application mobile de quiz compétitif local, jouable à plusieurs via **Bluetooth BLE**, avec génération de questions par **IA (Groq / Llama 3.3)** et synchronisation cloud via **Supabase**.

---

## Sommaire

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration des clés API](#configuration-des-clés-api)
- [Base de données Supabase](#base-de-données-supabase)
- [Lancer l'application](#lancer-lapplication)
- [Fonctionnalités](#fonctionnalités)
- [Flux de jeu](#flux-de-jeu)
- [Protocole Bluetooth](#protocole-bluetooth)
- [Questions de fallback](#questions-de-fallback)
- [Tests](#tests)

---

## Aperçu

QuizBattle permet à un groupe d'amis dans la même pièce de s'affronter sur des quiz générés en temps réel par une IA. Un téléphone fait office de **HOST** (héberge la session Bluetooth), les autres sont **CLIENTS** (rejoignent via scan BLE). Toutes les questions sont générées à la demande par **Groq / Llama 3.3-70b**, avec un fallback local de 50 questions si l'API est indisponible.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | React Native CLI — TypeScript strict |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| State | Zustand (stores séparés par domaine) |
| Stockage local | react-native-mmkv (synchrone, rapide) |
| Stockage cloud | Supabase (PostgreSQL + Auth anonyme) |
| IA | Groq API — modèle `llama-3.3-70b-versatile` |
| Bluetooth | react-native-ble-plx (GATT BLE) |
| Animations | react-native-reanimated v3 + react-native-gesture-handler |
| Icônes | react-native-vector-icons (MaterialCommunityIcons) |
| HTTP | axios + axios-retry (timeout 15s, 2 retries) |
| SVG | react-native-svg (TimerRing animé) |

---

## Architecture du projet

```
src/
├── api/
│   ├── groq.ts              # Client Groq + builder de prompt
│   ├── supabase.ts          # Client Supabase + auth anonyme
│   └── index.ts
│
├── bluetooth/
│   ├── BleManager.ts        # Singleton BLE (scan, connect, read/write)
│   ├── BleHost.ts           # Logique HOST : broadcast questions, collecte réponses
│   ├── BleClient.ts         # Logique CLIENT : connexion, envoi réponses
│   ├── BleProtocol.ts       # UUIDs + encode/decode base64 <-> UTF-8
│   └── useBluetooth.ts      # Hooks React pour HOST et CLIENT
│
├── components/
│   ├── ui/                  # Composants de base réutilisables
│   │   ├── Button.tsx        (variants: primary, secondary, ghost, danger)
│   │   ├── Card.tsx          (avec glow optionnel)
│   │   ├── Badge.tsx         (status / score / rang)
│   │   ├── Avatar.tsx        (initiales, couleur déterministe)
│   │   ├── ProgressBar.tsx   (animée)
│   │   ├── TimerRing.tsx     (anneau SVG, couleur dynamique)
│   │   ├── Divider.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   └── team/
│       └── CreateTeamSheet.tsx  # Bottom sheet création d'équipe
│
├── constants/
│   ├── theme.ts             # Design system (couleurs, typo, espacements)
│   ├── config.ts            # Timeouts, limites, options de jeu
│   ├── ble.ts               # UUIDs des services et caractéristiques BLE
│   ├── subjects.ts          # 12 sujets prédéfinis + couleurs équipes
│   └── fallbackQuestions.ts # 50 questions locales (backup offline)
│
├── hooks/
│   ├── useGroqQuiz.ts       # Génération IA + parsing + fallback local
│   ├── useTimer.ts          # Timer animé avec Reanimated
│   └── useHaptics.ts        # Retours haptiques (vibrations)
│
├── navigation/
│   ├── RootNavigator.tsx    # Stack racine (Splash -> Onboarding ou Main)
│   ├── MainNavigator.tsx    # Bottom tabs (Home, Profil)
│   ├── GameNavigator.tsx    # Stack du flux de jeu
│   └── types.ts             # Types de navigation TypeScript
│
├── screens/
│   ├── onboarding/          # Splash + Onboarding 3 étapes
│   ├── home/                # Dashboard + historique des parties
│   ├── lobby/               # Création session (HOST), scan + rejoindre (CLIENT)
│   ├── config/              # Configuration du quiz (sujet, difficulté, mode)
│   ├── game/                # Génération IA, jeu, résultats
│   └── profile/             # Profil utilisateur + stats
│
├── stores/
│   ├── profileStore.ts      # Profil joueur (persisté MMKV)
│   ├── gameStore.ts         # État du quiz en cours
│   ├── teamsStore.ts        # Équipes, scores, éliminations
│   └── historyStore.ts      # Historique (MMKV local + sync Supabase)
│
├── types/                   # Types TypeScript globaux
│   ├── quiz.ts
│   ├── team.ts
│   ├── profile.ts
│   └── ble.ts
│
└── utils/
    ├── storage.ts           # Wrappers MMKV typés (get/set/delete)
    ├── scoring.ts           # Calcul score + bonus vitesse
    ├── avatarColor.ts       # Couleur déterministe depuis un nom
    ├── questionParser.ts    # Parse + validation du JSON Groq
    └── permissions.ts       # Demande de permissions BLE Android
```

---

## Prérequis

- **Node.js** >= 22.11.0
- **React Native CLI** : `npm install -g react-native-cli`
- **Android Studio** avec émulateur ou téléphone Android (USB + débogage USB activé)
- **JDK 17** (requis par React Native 0.85)
- Un compte **Groq** (gratuit) : https://console.groq.com
- Un projet **Supabase** (gratuit) : https://supabase.com

---

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/Nestorservice/quizbattle.git
cd quizbattle

# 2. Installer les dépendances
npm install

# 3. iOS uniquement
cd ios && pod install && cd ..
```

---

## Configuration des clés API

Crée un fichier `.env.local` à la racine du projet :

```env
# Groq -> https://console.groq.com -> "API Keys" -> "Create API Key"
GROQ_API_KEY=gsk_ta_cle_groq_ici

# Supabase -> ton projet -> Settings -> API
SUPABASE_URL=https://tonprojet.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
```

> `.env.local` est dans `.gitignore`. Ne commite jamais tes clés.

---

## Base de données Supabase

### 1. Créer les tables

Dans le dashboard Supabase : **SQL Editor -> New query**

Colle le contenu du fichier `supabase_schema.sql` et clique **Run**.

Cela crée 3 tables :
- `profiles` — profils joueurs (pseudo, âge, niveau, intérêts)
- `game_sessions` — historique des parties
- `game_results` — résultats par équipe par session

### 2. Activer l'authentification anonyme

Dashboard Supabase : **Authentication -> Providers -> Anonymous -> Enable**

Cela permet à l'app d'attribuer une identité unique à chaque téléphone sans demander d'email ni de mot de passe.

---

## Lancer l'application

```bash
# Terminal 1 — Démarrer Metro (bundler JS)
npm start

# Terminal 2 — Lancer sur Android
npm run android

# Pour iOS
npm run ios
```

---

## Fonctionnalités

### Onboarding
- 3 étapes paginées : pseudo + groupe d'âge, niveau (Débutant / Intermédiaire / Expert), domaines d'intérêt
- Validation en temps réel — bouton "Suivant" désactivé si le formulaire est incomplet
- Données persistées localement (MMKV)

### Accueil
- Avatar avec initiales colorées (couleur générée automatiquement depuis le pseudo)
- Boutons : **Créer une partie** (HOST Bluetooth) et **Rejoindre une partie** (CLIENT)
- Statistiques personnelles et historique des 10 dernières parties

### Lobby — HOST
- Créer des équipes avec nom, couleur, icône et liste de membres (tags)
- Voir les appareils connectés en temps réel
- Lancer la partie quand au moins 2 équipes sont prêtes

### Rejoindre — CLIENT
- Scan Bluetooth automatique des sessions disponibles
- Affichage de la force du signal (RSSI)
- Connexion en un tap, salle d'attente pendant le chargement

### Configuration du quiz
- Sujet libre (champ texte) ou parmi 12 catégories prédéfinies
- Nombre de questions : 5 / 8 / 10 / 12 / 15
- Difficulté : Facile / Moyen / Expert
- Mode d'élimination :
  - 3 erreurs = équipe éliminée
  - Dernier du classement éliminé à chaque round
  - Score pur (pas d'élimination)
- Durée par question : 10s / 15s / 20s / 30s

### Génération IA (Groq)
- Appel à `llama-3.3-70b-versatile` avec le profil du joueur et la config choisie
- Messages d'attente animés pendant la génération (~5-10 secondes)
- Parsing + validation stricte du JSON retourné
- Fallback automatique vers 50 questions locales si l'API échoue ou si pas de réseau

### Jeu
- Timer animé (anneau SVG vert -> or -> rouge)
- Vibration haptique à 5 secondes restantes
- Sélection de réponse : animation spring, reveal immédiat
- Explication factuelle de la bonne réponse après chaque question
- Scoreboard mini scrollable en bas de l'écran
- Gestion des éliminations en temps réel

### Résultats
- Podium animé (colonnes qui montent en séquence)
- Classement complet avec scores de chaque équipe
- Sauvegarde automatique locale (MMKV) + sync Supabase en arrière-plan
- Boutons : Rejouer (même config) ou Retour à l'accueil

---

## Flux de jeu

```
[HOST]                              [CLIENT(s)]
  |                                      |
  | startAsHost()                        |
  | broadcastState('lobby')              |
  |                                      | scan BLE -> trouve HOST
  |                                      | connectToHost()
  | <- join { teamId, teamName }         |
  |                                      |
  | broadcastTeams([...])           -->  |
  |                                      | <- affiche équipes (WaitingRoom)
  | [HOST configure + génère quiz]       |
  |                                      |
  | broadcastQuestion(index, q)     -->  | <- question affichée simultanément
  |                                      |
  | <- answer { teamId, idx, ts }        | tap sur réponse -> sendAnswer()
  |                                      |
  | calcule scores de tous              |
  | broadcastReveal(correct, scores) --> | <- révélation + scores mis à jour
  |                                      |
  | [question suivante...]               |
  |                                      |
  | broadcastResults(final)         -->  | <- ResultsScreen
```

---

## Protocole Bluetooth

### UUIDs GATT

| Caractéristique | UUID | Direction |
|-----------------|------|-----------|
| Service principal | `12345678-1234-1234-1234-123456789abc` | — |
| Questions / État | `...9001` | HOST -> CLIENT (notify) |
| Réponses | `...9002` | CLIENT -> HOST (write) |
| État session | `...9003` | HOST -> CLIENT |
| Équipes | `...9004` | HOST -> CLIENT |

### Format des messages

Tous les messages sont du **JSON stringifié encodé en base64**, taille max 512 bytes.

```typescript
// HOST -> CLIENT
{ type: 'question', index: 2, total: 10, question: {...}, startAt: 1700000000 }
{ type: 'reveal', correctIndex: 1, scores: { 'team_1': 350, 'team_2': 200 } }
{ type: 'results', final: [{ teamId, rank, score, ... }] }

// CLIENT -> HOST
{ type: 'join', teamId: 'team_123', teamName: 'Les Faucons' }
{ type: 'answer', teamId: 'team_123', answerIndex: 2, timestamp: 1700000010 }
```

### Calcul du score

```
score = 100 (base) + bonus vitesse (0 à 300 points)
bonus vitesse = (1 - temps_réponse / durée_totale) × 300
```

Plus tu réponds vite, plus tu gagnes de points bonus.

---

## Questions de fallback

Le fichier `src/constants/fallbackQuestions.ts` contient **50 questions** réparties en 5 catégories :

| Catégorie | Nombre |
|-----------|--------|
| Sciences & Nature | 10 |
| Histoire & Géographie (focus Afrique) | 10 |
| Technologie | 10 |
| Culture Générale | 10 |
| Sport | 10 |

Ces questions sont utilisées automatiquement si l'API Groq est indisponible. Un message "Mode hors-ligne activé" s'affiche discrètement dans ce cas.

---

## Tests

### Vérification TypeScript

```bash
npx tsc --noEmit
```

### Tests unitaires

```bash
npm test
```

### Test du flux complet (1 téléphone)

1. Premier lancement -> Onboarding -> crée ton profil
2. Home -> **Créer une partie**
3. Lobby -> FAB `+` -> crée 2 équipes minimum
4. **Lancer le Quiz** -> QuizConfig -> tape un sujet -> **Générer**
5. Génération IA (~5-10s) -> GameScreen -> réponds aux questions
6. ResultsScreen -> vérifie le podium animé

### Test offline

Désactive le Wi-Fi et les données mobiles -> Lance une partie -> l'app utilise les 50 questions locales.

### Test Bluetooth (2 téléphones Android)

**Téléphone A (HOST)** : Home -> Créer une partie -> crée 2 équipes -> Lance le quiz

**Téléphone B (CLIENT)** : Home -> Rejoindre une partie -> sélectionne le téléphone A -> WaitingRoom -> joue

> Nécessite Android 6+ et Bluetooth activé. Distance max recommandée : 10 mètres.

### Logs de debug

```bash
# Logs Android en temps réel
npx react-native log-android

# Vider le cache Metro
npm start -- --reset-cache
```

---

## Design System

| Token | Valeur |
|-------|--------|
| Fond principal | `#08080F` |
| Surface | `#111120` |
| Accent or | `#F0C93A` |
| Accent bleu | `#3A8EF0` |
| Succès | `#2ECC71` |
| Danger | `#E8453C` |
| Texte primaire | `#F2F2F8` |
| Police display | Syne Bold 700 |
| Police body | DM Sans 400 / 500 |
| Espacement base | 8pt (xs=4, sm=8, md=16, lg=24, xl=32) |

---

## Licence

Projet académique — ICT202 · L2 S2
