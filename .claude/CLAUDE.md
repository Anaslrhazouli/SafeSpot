# CLAUDE.md

## Project
SafeSpot Student

SafeSpot Student is a cross-platform mobile app for students and young professionals to save, organize, and revisit trusted places around them:
- quiet cafés to study
- safe spots at night
- useful pharmacies
- parking spots
- work-friendly places
- useful city locations

The app must feel mobile-first, clean, modern, minimal, and trustworthy.

---

## Primary Goal

Build a production-like mobile app that satisfies the course requirements while staying realistic and focused.

The app must include:
- authentication
- list screen
- detail screen
- add/edit form
- settings screen
- async API calls
- remote data storage
- at least one native mobile capability
- clean code architecture
- loading / success / error states
- minimum offline resilience with already loaded data

---

## Product Positioning

This is not a generic map app.
This is a personal, curated memory of trusted places.

Each spot is contextual and useful:
- safe at night
- quiet
- Wi-Fi
- power outlets
- cheap
- open late
- easy access

The product should feel:
- calm
- safe
- smart
- premium
- simple

---

## MVP Scope

### Required flows
1. Sign up
2. Sign in
3. View user’s spots
4. Create a spot
5. View spot details
6. Edit a spot
7. Delete a spot
8. Open settings
9. Logout

### Required spot fields
- id
- user_id
- title
- category
- description
- address
- latitude
- longitude
- rating
- is_favorite
- is_safe_at_night
- created_at
- updated_at

### Recommended categories
- Study
- Safe
- Food
- Health
- Parking
- Quiet
- Photo
- Work

### Recommended tags
- wifi
- outlets
- calm
- open late
- cheap
- accessible
- bright
- safe

---

## Native Feature

Primary native capability: geolocation

Use geolocation for:
- current user position
- adding a spot from current location
- distance calculation
- sorting nearby spots
- optional map centering

Permissions must:
- be requested only when needed
- be justified clearly to the user
- be handled gracefully if denied

Fallback when permission is denied:
- allow manual address entry
- keep the app usable

Optional secondary native features:
- camera for spot photo
- local notifications later if needed

---

## Tech Direction

Preferred stack:
- React Native with Expo
- TypeScript
- React Navigation
- Supabase
- Expo Location
- AsyncStorage for local cache
- React Query or equivalent async state layer if useful

If a different stack is used, keep the same architecture principles.

---

## Architecture Rules

Always keep a clear separation between:
- UI / screens / components
- application logic
- data access

### Do
- keep API calls out of UI components
- isolate business logic
- use services/repositories/hooks
- type everything clearly
- keep components small and readable
- handle loading, empty, success, and error states
- design for maintainability

### Do not
- call Supabase directly inside large screen JSX if avoidable
- mix UI and business logic everywhere
- create over-engineered abstractions too early
- add unrelated features outside the project scope

---

## Suggested Folder Structure

src/
- app/
- screens/
- components/
- navigation/
- features/
- services/
- repositories/
- hooks/
- lib/
- types/
- utils/
- theme/

Example:
- screens/AuthScreen.tsx
- screens/SpotListScreen.tsx
- screens/SpotDetailScreen.tsx
- screens/EditSpotScreen.tsx
- screens/SettingsScreen.tsx
- services/locationService.ts
- services/authService.ts
- repositories/spotsRepository.ts
- theme/tokens.ts

---

## Data Model

### profiles
- id
- email
- display_name
- created_at

### spots
- id
- user_id
- title
- category
- description
- address
- latitude
- longitude
- rating
- is_favorite
- is_safe_at_night
- created_at
- updated_at

### optional spot_tags
- id
- spot_id
- label

### optional spot_photos
- id
- spot_id
- image_url

Keep schema simple and course-friendly.

---

## UX Rules

The app should feel native and easy to demo.

### Main screens
- Welcome / Onboarding
- Login / Sign up
- Home list
- Spot detail
- Add / Edit spot
- Settings

### UI principles
- one-hand usability
- strong hierarchy
- calm spacing
- short forms
- clear primary actions
- meaningful empty states
- subtle feedback for success/error
- not cluttered
- not gamified

### Required states
Every important async screen should support:
- loading
- empty
- success
- error
- cached/already-loaded fallback when offline

---

## Visual Direction

Modern minimal design system.

### Brand feeling
- calm
- safe
- modern
- premium
- minimal

### Colors
- primary: #1F3A5F
- primaryDark: #152A45
- secondary: #7FA38A
- accent: #E9846E
- background: #F7F8F5
- surface: #FFFFFF
- surfaceAlt: #F1F3EE
- border: #D9DED6
- textPrimary: #182028
- textSecondary: #5E6873
- textTertiary: #8A939C
- success: #4C9A6A
- warning: #D9A441
- error: #D65C5C
- info: #5C8FD6

### Typography
- Inter or SF Pro style
- display: 32 / 700
- h1: 24 / 700
- h2: 20 / 600
- h3: 18 / 600
- body: 16 / 400
- caption: 14 / 400
- small: 12 / 500

### Radius
- sm: 10
- md: 16
- lg: 22
- xl: 28
- pill: 999

### Spacing
- 4, 8, 12, 16, 20, 24, 32, 40

---

## Implementation Priority

Build in this order:
1. App shell and navigation
2. Theme tokens
3. Auth flow
4. Supabase connection
5. Spot list screen
6. Add spot flow
7. Spot detail screen
8. Edit/delete flow
9. Settings screen
10. Geolocation integration
11. Loading/error/offline handling
12. UI polish and demo readiness

---

## Definition of Done

A task is done only if:
- it works on mobile
- types are clean
- loading and error states exist
- code respects architecture boundaries
- UI matches the design direction
- the feature fits the course scope
- no major dead code or hacks were introduced

---

## Demo Readiness Checklist

The app should be easy to show in a short demo:
- login works
- list loads
- add spot works
- detail works
- edit works
- delete works
- persistence survives restart
- geolocation permission is requested properly
- permission denial is handled
- loading and error state can be shown
- settings screen exists

---

## Working Style for Claude

When helping on this project:
- prioritize practical implementation over theory
- propose incremental changes
- keep the project simple and coherent
- preserve architecture consistency
- prefer readable code over clever code
- avoid adding features not required by MVP
- when unsure, choose the simpler mobile-first solution
- always respect the existing design tokens and app identity