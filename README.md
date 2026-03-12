# SafeSpot Student

A personal mobile app for students and young professionals to save, organize, and revisit trusted places — quiet study cafés, safe spots at night, useful pharmacies, parking spots, and more.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 52 |
| Language | TypeScript (strict) |
| Navigation | Expo Router v4 (file-based) |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Maps | react-native-maps |
| Photos | expo-image-picker + Supabase Storage |
| Location | expo-location |
| Offline | AsyncStorage cache |
| Secure Storage | expo-secure-store |

---

## Architecture

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Primitives (Button, Input, Card, Badge, etc.)
│   └── spots/        # Domain components (SpotCard, SpotForm, etc.)
├── constants/        # Categories, tags, config
├── hooks/            # Custom hooks (useAuth, useSpots, useLocation)
├── lib/              # Supabase client, QueryClient
├── providers/        # React Context providers (Auth, Query)
├── repositories/     # Data access layer (spots, tags, photos, profile)
├── services/         # Business logic (auth, location, photo)
├── storage/          # AsyncStorage offline cache
├── theme/            # Design tokens (colors, spacing, typography)
├── types/            # TypeScript interfaces & Zod schemas
└── utils/            # Formatting helpers

app/                  # Expo Router file-based routes
├── _layout.tsx       # Root layout (providers + auth gate)
├── index.tsx         # Entry redirect
├── (auth)/           # Unauthenticated screens
│   ├── welcome.tsx
│   └── login.tsx
└── (tabs)/           # Authenticated tab navigator
    ├── index.tsx     # Home — spot list
    ├── map.tsx       # Map view — all spots
    ├── add.tsx       # Add new spot
    ├── settings.tsx  # Profile & preferences
    └── spot/
        ├── [id].tsx       # Spot detail
        └── edit/[id].tsx  # Edit spot
```

### Key Patterns

- **Repository pattern** — all Supabase queries isolated in `src/repositories/`
- **Service layer** — business logic (auth, photo upload, geolocation) in `src/services/`
- **Custom hooks** — TanStack Query hooks in `src/hooks/` manage caching, loading, and error states
- **No API calls in JSX** — screens call hooks, hooks call repositories/services

---

## Setup

### 1. Prerequisites

- Node.js ≥ 18
- Expo CLI: `npm install -g expo-cli`
- A [Supabase](https://supabase.com) project
- (Optional) Google Maps API key for Android map tiles

### 2. Clone & Install

```bash
git clone <repo-url>
cd SafeSpot
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # local only, never in the app
GOOGLE_MAPS_API_KEY_ANDROID=your-key              # optional, for Android maps
GOOGLE_MAPS_API_KEY_IOS=your-key                  # optional, for iOS maps
```

### 4. Database Setup

**Option A — SQL Editor (recommended):**

1. Open your Supabase project → SQL Editor
2. Paste the contents of `supabase/migrations/0001_init.sql`
3. Run it

**Option B — Bootstrap script:**

```bash
node scripts/bootstrap-db.mjs
```

### 5. Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create bucket named `spot-photos` (public)
3. Add storage policies as documented in the migration SQL comments

### 6. Run

```bash
npx expo start
```

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go on a physical device

---

## Features

### Core

- Email/password authentication (sign up, sign in, sign out)
- View all your spots in a list with search and category filters
- Full-screen map view with category-colored markers
- Create a spot with all fields, photos, tags, and current location
- View spot details with photo gallery and all metadata
- Edit a spot (all fields, tags, photos)
- Delete a spot with confirmation
- Settings screen with profile info, permissions, and sign out
- Geolocation (current position, distance display, permission handling)
- Photo upload (camera + gallery → Supabase Storage)
- Offline resilience (cached spots list)
- Loading, error, and empty states on all screens

### Native Capabilities

- **Geolocation** via `expo-location` — request permission, current position, distance calculation
- **Camera & Photo Library** via `expo-image-picker` — take or select photos
- **Secure Storage** via `expo-secure-store` — auth tokens stored securely

---

## Data Model

| Table | Description |
|-------|------------|
| `profiles` | User profile (auto-created via trigger) |
| `spots` | User's saved places with coordinates, rating, metadata |
| `spot_tags` | Tags attached to spots (wifi, outlets, calm, etc.) |
| `spot_photos` | Photo URLs stored in Supabase Storage |

All tables use Row Level Security — users can only access their own data.

---

## Spot Categories

Study · Safe · Food · Health · Parking · Quiet · Photo · Work

## Tags

wifi · outlets · calm · open late · cheap · accessible · bright · safe

---

## Demo Checklist

- [ ] Sign up / sign in works
- [ ] Spot list loads with search and filters
- [ ] Map shows all spots with markers
- [ ] Create a spot with photos and current location
- [ ] View spot detail with photo gallery
- [ ] Edit a spot
- [ ] Delete a spot
- [ ] Data persists after restart
- [ ] Location permission requested when needed
- [ ] Permission denial handled gracefully
- [ ] Loading and error states visible
- [ ] Settings screen with sign out

---

## License

Student project — not licensed for production use.
