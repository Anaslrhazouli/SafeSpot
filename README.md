# SafeSpot Student

Application mobile personnelle pour les etudiants et jeunes professionnels permettant de sauvegarder, organiser et retrouver des lieux de confiance — cafes calmes pour etudier, endroits surs la nuit, pharmacies utiles, places de parking, et bien plus.

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Framework | React Native + Expo SDK 52 |
| Langage | TypeScript (strict) |
| Navigation | Expo Router v4 (file-based) |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| Etat serveur | TanStack Query v5 |
| Formulaires | React Hook Form + Zod |
| Cartes | react-native-maps |
| Photos | expo-image-picker + Supabase Storage |
| Localisation | expo-location |
| Cache hors-ligne | AsyncStorage |
| Stockage securise | expo-secure-store |

---

## Architecture

```
src/
├── components/       # Composants UI reutilisables
│   ├── ui/           # Primitives (Button, Input, Card, Badge, Toggle, etc.)
│   └── spots/        # Composants metier (SpotCard, SpotForm, etc.)
├── constants/        # Categories, tags, configuration
├── hooks/            # Hooks personnalises (useAuth, useSpots, useLocation)
├── lib/              # Client Supabase, QueryClient
├── providers/        # Providers React Context (Auth, Query)
├── repositories/     # Couche d'acces aux donnees (spots, tags, photos, profil)
├── services/         # Logique metier (auth, location, photo, places)
├── storage/          # Cache hors-ligne AsyncStorage
├── theme/            # Design tokens (couleurs, espacements, typographie)
├── types/            # Interfaces TypeScript et schemas Zod
└── utils/            # Helpers de formatage

app/                  # Routes basees sur les fichiers (Expo Router)
├── _layout.tsx       # Layout racine (providers + auth gate)
├── index.tsx         # Redirection d'entree
├── (auth)/           # Ecrans non authentifies
│   ├── onboarding.tsx
│   ├── login.tsx
│   └── register.tsx
└── (tabs)/           # Navigation par onglets (authentifie)
    ├── index.tsx     # Accueil — liste des spots
    ├── map.tsx       # Vue carte — tous les spots
    ├── add.tsx       # Ajouter un spot
    ├── saved.tsx     # Collection — favoris et spots surs
    ├── settings.tsx  # Profil et parametres
    └── spot/
        ├── [id].tsx       # Detail d'un spot
        └── edit/[id].tsx  # Modifier un spot
```

---

## Fonctionnalites

### Authentification

- Inscription par email, mot de passe et nom d'affichage
- Connexion par email et mot de passe
- Deconnexion avec confirmation
- Reinitialisation du mot de passe par email
- Gestion automatique de la session (tokens stockes de maniere securisee)

### Liste des spots (Accueil)

- Affichage de tous les spots de l'utilisateur
- Recherche par titre, description ou adresse
- Filtrage par categorie (chips selectionnables)
- Tri par : recent, plus proche, note, nom (A-Z)
- Affichage de la distance depuis la position actuelle
- Vignettes photo pour chaque spot
- Pull-to-refresh pour actualiser la liste
- Etats de chargement, erreur et liste vide

### Vue Carte

- Carte interactive avec tous les spots geolocalises
- Marqueurs colores par categorie avec icones
- Popups d'information au clic sur un marqueur
- Recherche et filtrage directement sur la carte
- Bouton "Ma position" pour centrer sur la localisation actuelle
- Bottom sheet affichant les spots les plus proches (jusqu'a 10)
- Affichage de la distance pour chaque spot proche
- Region par defaut (Paris) si aucune localisation disponible

### Ajout d'un spot

- Formulaire complet avec validation Zod
- Champs : titre, categorie, description, adresse, note, photos, tags
- Autocompletion d'adresse via Google Places API
- Bouton "Utiliser ma position actuelle" pour remplir automatiquement
- Selection de photos depuis la camera ou la galerie (max 5)
- Selection multiple de tags (wifi, prises, calme, etc.)
- Toggles favori et "sur la nuit"
- Selecteur de note (0 a 5 etoiles)
- Toast de confirmation apres creation

### Detail d'un spot

- Affichage complet de toutes les informations
- Carrousel de photos
- Badges categorie et tags
- Adresse, note, date de creation
- Toggle favori
- Bouton "Itineraire" (ouvre l'application de navigation native)
- Bouton "Partager" (fiche de partage systeme native)
- Bouton "Modifier"
- Bouton "Supprimer" avec confirmation

### Modification d'un spot

- Formulaire pre-rempli avec les donnees existantes
- Modification de tous les champs, tags et photos
- Validation et soumission
- Toast de confirmation apres mise a jour

### Suppression d'un spot

- Suppression avec dialogue de confirmation
- Suppression en cascade des tags et photos associes

### Collection (Sauvegardes)

- Vue collection avec cartes de statistiques
- Filtrage par : Tous, Favoris, Surs la nuit
- Liste avec vignettes, distance, categorie et note
- Pull-to-refresh

### Parametres

- Section profil avec avatar (initiale) et email
- Badge "SafeSpot Student"
- Statistiques : nombre de spots, favoris, categories utilisees
- Top categories de l'utilisateur
- Indicateur du statut de permission de localisation
- Version de l'application
- Bouton de deconnexion avec confirmation

---

## Fonctionnalites Natives du Telephone

### 1. Geolocalisation (expo-location)

- Demande de permission de localisation (foreground)
- Recuperation de la position actuelle de l'appareil
- Geocodage inverse (coordonnees vers adresse lisible)
- Calcul de distance Haversine entre deux points
- Centrage de la carte sur la position actuelle
- Affichage de la distance sur chaque spot
- Statut de permission visible dans les parametres
- Fallback si permission refusee : saisie manuelle d'adresse

### 2. Camera et Galerie Photo (expo-image-picker)

- Prise de photo avec la camera de l'appareil
- Selection de photo depuis la galerie
- Recadrage et edition de l'image (ratio 4:3)
- Compression des images (qualite 0.8)
- Jusqu'a 5 photos par spot
- Demande de permission camera et bibliotheque media

### 3. Cartes Interactives (react-native-maps)

- Carte interactive avec marqueurs
- Localisation de l'utilisateur sur la carte
- Marqueurs personnalises par categorie (couleur + icone)
- Callouts avec informations du spot
- Bottom sheet des spots a proximite

### 4. Navigation Native

- Ouverture de l'application de cartes native pour l'itineraire
- Schemas URL specifiques : iOS (`maps:`) et Android (`geo:`)

### 5. Partage Systeme

- Partage des details d'un spot via la fiche de partage native iOS/Android
- Contenu partage : titre, categorie, adresse, note, description

### 6. Stockage Securise (expo-secure-store)

- Stockage securise des tokens d'authentification sur l'appareil
- Chiffrement natif iOS Keychain / Android Keystore

### 7. Cache Local (AsyncStorage)

- Cache de la liste des spots pour resilience hors-ligne
- Donnees deja chargees disponibles meme sans connexion

---

## Modele de Donnees

| Table | Description |
|-------|-------------|
| `profiles` | Profil utilisateur (cree automatiquement via trigger) |
| `spots` | Lieux sauvegardes avec coordonnees, note, metadonnees |
| `spot_tags` | Tags attaches aux spots (wifi, prises, calme, etc.) |
| `spot_photos` | URLs des photos stockees dans Supabase Storage |

Toutes les tables utilisent le Row Level Security — chaque utilisateur ne peut acceder qu'a ses propres donnees.

### Categories

Study · Safe · Food · Health · Parking · Quiet · Photo · Work · Coffee · Shopping · Nature · Nightlife

### Tags

wifi · outlets · calm · open late · cheap · accessible · bright · safe · cozy · quiet · pet friendly · parking · outdoor seating · good coffee

---

## Installation et Lancement

### 1. Pre-requis

- Node.js >= 18
- Expo CLI : `npm install -g expo-cli`
- Un projet [Supabase](https://supabase.com)
- (Optionnel) Cle API Google Maps pour les tuiles Android

### 2. Cloner et Installer

```bash
git clone <url-du-repo>
cd SafeSpot
npm install
```

### 3. Variables d'Environnement

Creer un fichier `.env` a la racine :

```
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=votre-cle-anon
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=votre-cle-google   # optionnel
```

### 4. Base de Donnees

1. Ouvrir votre projet Supabase > SQL Editor
2. Coller et executer le contenu de `supabase/migrations/0001_init.sql`
3. Coller et executer le contenu de `supabase/migrations/0002_storage_policies.sql`

### 5. Bucket de Stockage

1. Supabase Dashboard > Storage
2. Creer un bucket nomme `spot-photos` (public)

### 6. Peupler la Base (optionnel)

Un script de seed est disponible pour remplir la base avec des donnees de test :

```bash
npx tsx scripts/seed.ts
```

> Necessite la cle `service_role` de Supabase dans le fichier `scripts/seed.ts`.

### 7. Lancer l'Application

```bash
npx expo start
```

- Appuyer sur `i` pour le simulateur iOS
- Appuyer sur `a` pour l'emulateur Android
- Scanner le QR code avec Expo Go sur un appareil physique

---

## Comptes de Test

Tous les comptes utilisent le mot de passe : **`Test1234!`**

| Email | Nom | Spots |
|-------|-----|-------|
| alice@safespot.test | Alice Martin | Shakespeare and Company, Cafe de Flore, Jardin du Luxembourg, Promenade des Anglais |
| bob@safespot.test | Bob Dupont | Pharmacie Citypharma, Slake Coffee House, Bibliotheque Part-Dieu, Cafe du Cycliste |
| claire@safespot.test | Claire Bernard | Parc de la Tete d'Or, Cafe Borely, Le Vieux-Port, Petite France Quarter |
| david@safespot.test | David Moreau | Pharmacie du Prado, Black List Coffee, Miroir d'Eau, Parking Gloriette |
| emma@safespot.test | Emma Leroy | Parking Tourny, Cafe Bibent, Mediatheque Jose Cabanis, Lieu Unique |

Les spots couvrent 8 villes francaises : Paris, Lyon, Marseille, Bordeaux, Toulouse, Nice, Strasbourg, Nantes.

---

## Licence

Projet etudiant — non licence pour un usage en production.
