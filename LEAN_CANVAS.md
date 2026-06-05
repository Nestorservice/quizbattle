# Lean Canvas — QuizBattle

---

## 1. PROBLÈME
*Les 3 problèmes principaux que QuizBattle résout*

| # | Problème |
|---|----------|
| 1 | Les jeux de quiz en groupe (Kahoot, Quizz.biz) nécessitent tous une connexion Internet stable — impossible dans des zones à faible réseau ou lors de soirées sans Wi-Fi fiable |
| 2 | Les questions des quiz génériques sont répétitives et ne s'adaptent pas au niveau ni aux intérêts du groupe |
| 3 | Il n'existe pas de jeu de quiz compétitif local simple à lancer entre amis sans s'inscrire, sans compte, sans configuration complexe |

**Alternatives existantes utilisées aujourd'hui :**
- Kahoot (nécessite Internet + compte enseignant)
- Quizz.biz (navigateur Web, pas mobile-first)
- Questions pour un champion (jeu de société physique, pas interactif)

---

## 2. SEGMENTS CLIENTS
*Pour qui exactement ?*

**Segment principal — Étudiants (15-25 ans)**
- En soirée, en coloc, en salle de cours
- Veulent s'amuser rapidement sans friction
- À l'aise avec le mobile

**Segment secondaire — Familles & groupes d'amis (25-45 ans)**
- Réunions familiales, vacances, voyages en groupe
- Veulent jouer ensemble sans dépendre du Wi-Fi de l'hôtel

**Segment tertiaire — Enseignants & formateurs**
- Animation de cours ou ateliers en présentiel
- Besoin d'un outil interactif qui fonctionne sans réseau scolaire

**Early adopters :**
Étudiants en tech/gaming, habitués des soirées jeux, toujours le téléphone en main.

---

## 3. PROPOSITION DE VALEUR UNIQUE
*Pourquoi QuizBattle et pas un autre ?*

> **"Le seul quiz multijoueur qui fonctionne sans Internet, génère des questions sur n'importe quel sujet par IA, et se lance en 30 secondes entre amis."**

Points différenciants :
- **Bluetooth** = zéro dépendance réseau, joue partout
- **IA générative** = questions illimitées, infiniment variées, adaptées au niveau
- **Zéro friction** = pas de compte, pas d'inscription, prêt en 30 secondes
- **Compétitif** = modes d'élimination, bonus vitesse, podium animé

---

## 4. SOLUTION
*Comment QuizBattle résout chaque problème*

| Problème | Solution |
|----------|----------|
| Pas d'Internet | Connexion peer-to-peer via **Bluetooth BLE** — fonctionne jusqu'à 10m sans réseau |
| Questions répétitives | **Groq / Llama 3.3** génère des questions uniques à chaque partie, adaptées au profil et au sujet choisi |
| Trop de friction | Onboarding en 3 étapes, **pas de compte requis**, partie lancée en < 1 minute |

**Fonctionnalités clés :**
- Génération IA sur n'importe quel sujet (texte libre ou 12 catégories prédéfinies)
- Multijoueur local BLE (1 HOST + N CLIENTs)
- 3 modes d'élimination + bonus vitesse
- 50 questions de fallback si offline total
- Historique des parties synchronisé sur Supabase

---

## 5. CANAUX
*Comment atteindre les clients*

**Court terme (lancement) :**
- Bouche-à-oreille entre étudiants (effet viral naturel : jouer ensemble = recommander)
- Publication sur les groupes Facebook/WhatsApp d'étudiants
- TikTok / Instagram Reels — vidéos de gameplay en soirée

**Moyen terme :**
- Google Play Store + Apple App Store (ASO sur "quiz multijoueur", "quiz Bluetooth")
- Partenariats avec associations étudiantes
- Enseignants / formateurs sur LinkedIn

**Long terme :**
- Programme ambassadeurs dans les universités
- Intégration dans des événements (team building, soirées gaming)

---

## 6. FLUX DE REVENUS
*Comment QuizBattle gagne de l'argent*

| Modèle | Description | Prix estimé |
|--------|-------------|-------------|
| **Freemium** | Version gratuite : 5 parties/mois avec IA, illimité en fallback | Gratuit |
| **Premium mensuel** | Parties IA illimitées + thèmes exclusifs + stats avancées | 2,99 €/mois |
| **Pack équipe** | Pour enseignants/formateurs : jusqu'à 30 joueurs + tableau de bord | 9,99 €/mois |
| **In-app** | Packs de catégories spéciales (médecine, droit, code...) | 1,99 € / pack |

**Priorité lancement :** version 100% gratuite pour acquérir des utilisateurs, puis freemium à 6 mois.

---

## 7. STRUCTURE DE COÛTS
*Les dépenses principales*

| Poste | Coût estimé / mois |
|-------|-------------------|
| **Groq API** (génération IA) | ~15-50 $ selon volume (plan gratuit disponible au départ) |
| **Supabase** (base de données) | Gratuit jusqu'à 500 MB, puis ~25 $/mois |
| **Apple Developer** (iOS) | 99 $/an |
| **Google Play** (Android) | 25 $ une fois |
| **Développement & maintenance** | Coût principal (temps développeur) |
| **Marketing / ASO** | 50-200 $/mois selon budget |

**Point mort estimé :** ~150 utilisateurs Premium ou ~30 abonnés Pack équipe couvrent les coûts serveurs.

---

## 8. MÉTRIQUES CLÉS
*Comment mesurer le succès*

| Métrique | Objectif 3 mois | Objectif 1 an |
|----------|-----------------|---------------|
| Téléchargements | 500 | 10 000 |
| Parties jouées / semaine | 200 | 5 000 |
| Rétention J7 (revient après 7 jours) | 25% | 40% |
| Taux conversion Freemium → Premium | — | 5% |
| Note moyenne App Store / Play Store | 4,0+ | 4,5+ |
| Nombre de sessions multijoueurs BLE | 50/semaine | 1 000/semaine |

**Métrique nord (North Star) :** nombre de **parties multijoueurs complètes jouées par semaine** — c'est le cœur de valeur de l'app.

---

## 9. AVANTAGE DÉLOYAL
*Ce que les concurrents ne peuvent pas copier facilement*

| Avantage | Explication |
|----------|-------------|
| **Architecture BLE peer-to-peer** | Technique complexe à implémenter — peu de concurrents ont investi dedans |
| **IA adaptative** | Le prompt intègre le profil, le niveau, les intérêts du joueur — pas juste "génère 10 questions" |
| **Expérience zéro friction** | Pas de compte, pas de code de session, pas de navigateur — BLE automatique |
| **Fallback offline complet** | 50 questions locales = l'app est 100% utilisable même sans réseau ni clé API |
| **Design premium dark** | Expérience visuelle différenciante vs les concurrents à design scolaire/générique |

---

## RÉSUMÉ VISUEL

```
┌─────────────────────┬──────────────────┬──────────────────────┐
│     PROBLÈME        │    SOLUTION      │  PROPOSITION UNIQUE  │
│                     │                  │                      │
│ 1. Pas d'Internet   │ BLE peer-to-peer │ "Quiz IA multijoueur │
│ 2. Questions répét. │ Groq IA générat. │  sans Internet,      │
│ 3. Trop de friction │ 0 compte requis  │  prêt en 30 sec"     │
├─────────────────────┼──────────────────┼──────────────────────┤
│  AVANTAGE DÉLOYAL   │                  │  SEGMENTS CLIENTS    │
│                     │                  │                      │
│ BLE + IA adaptative │                  │ Étudiants 15-25 ans  │
│ Offline complet     │                  │ Familles & amis      │
│ Design premium      │                  │ Enseignants          │
├─────────────────────┼──────────────────┼──────────────────────┤
│  MÉTRIQUES CLÉS     │    CANAUX        │  FLUX DE REVENUS     │
│                     │                  │                      │
│ Parties/semaine     │ Bouche-à-oreille │ Freemium (gratuit)   │
│ Rétention J7        │ TikTok / Reels   │ Premium 2,99 €/mois  │
│ Sessions BLE        │ App Stores       │ Pack équipe 9,99 €   │
├─────────────────────┴──────────────────┴──────────────────────┤
│                    STRUCTURE DE COÛTS                         │
│         Groq API · Supabase · App Stores · Marketing          │
└───────────────────────────────────────────────────────────────┘
```

---

*Lean Canvas — QuizBattle · ICT202 · L2 S2*
