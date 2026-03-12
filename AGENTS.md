# AGENTS.md

## Repo-wide instructions

This repository contains a student mobile application project named SafeSpot Student.

All coding agents must read this file before making changes.

The goal is to build a coherent, maintainable, cross-platform mobile app that satisfies the course evaluation requirements and remains focused in scope.

---

## Product Summary

SafeSpot Student is a personal mobile app to save and revisit trusted places:
- quiet study cafés
- safe places at night
- helpful pharmacies
- parking spots
- useful city locations
- work-friendly places

It is a personal app, not a social network, not a marketplace, and not a generic map clone.

The value comes from contextual personal memory:
- quiet
- safe
- Wi-Fi
- outlets
- cheap
- open late
- trusted notes

---

## Non-Goals

Do not turn this into:
- a chat app
- a social feed
- a complex collaborative platform
- a full review ecosystem
- a large-scale recommendation engine
- a web dashboard first product

Keep the project focused and demo-friendly.

---

## Hard Project Constraints

The app must include:
- authentication
- multi-screen navigation
- list screen
- detail screen with edit/delete actions
- add/edit form
- settings screen
- async API/data flow
- remote data storage
- at least one native device capability
- clean code organization
- loading/success/error handling
- minimum offline support via already loaded data

The app should remain realistic for a student mobile project.

---

## Current Product Choice

Chosen concept: SafeSpot Student

Why this concept:
- mobile use case is natural
- geolocation fits the product
- CRUD is obvious
- auth makes sense
- demo is easy to structure
- the UI can look modern and premium
- it avoids boring “todo list” territory

---

## Preferred Stack

Unless the repo clearly states otherwise, assume:
- React Native
- Expo
- TypeScript
- Supabase
- Expo Location
- AsyncStorage
- React Navigation

Keep stack decisions lightweight and aligned with the course.

---

## Feature Scope

### Core features
- register
- login
- logout
- list user spots
- create a spot
- see spot details
- edit a spot
- delete a spot
- settings screen
- geolocation usage

### Optional features
Only add if core flow is stable:
- spot photo
- map view
- filters
- favorites
- sort by distance
- dark mode

Never prioritize optional features over core evaluation requirements.

---

## Spot Data Shape

Every spot should stay simple and useful.

Recommended fields:
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

Optional:
- tags
- image_url

Do not invent overly complex schema unless clearly needed.

---

## Native Capability Rules

Primary native feature: geolocation

Expected behavior:
- request permission only when needed
- explain why location is useful
- allow graceful denial flow
- offer manual address input if permission is denied
- use location for nearby context and add-from-current-location flow

If camera is later added, it must remain secondary.

---

## Architecture Rules

Respect a strong separation between:
- UI/screens
- business logic
- data access

### Required patterns
- reusable components
- repository/service layer for data access
- hooks for async state or feature orchestration
- typed models
- small focused screens and components

### Forbidden patterns
- large API logic directly inside JSX
- global unstructured state chaos
- mixing styling, network, and business logic in one file
- adding heavy abstractions for no reason

When editing code, preserve or improve structure.

---

## UI / Design Rules

The app must look:
- modern
- minimal
- calm
- trustworthy
- premium
- mobile-first

### Visual style
- soft off-white background
- deep navy primary
- sage secondary
- warm coral for highlights only
- rounded cards
- subtle shadows
- clear spacing
- excellent readability

### Color tokens
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
- body should stay readable
- no cramped layouts
- use whitespace generously

### Interaction style
- native-feeling navigation
- simple forms
- clear CTAs
- helpful empty states
- polished feedback on success/error

---

## UX Expectations by Screen

### Auth
- simple and reassuring
- minimal form
- no unnecessary friction

### Home/List
- search bar optional
- category chips useful
- clean cards
- obvious add action

### Detail
- strong title
- contextual badges/tags
- note content easy to read
- edit/delete visible but not aggressive

### Add/Edit
- one-column form
- short and structured
- current location CTA
- clear save action

### Settings
- simple
- profile
- theme if implemented
- location permission status
- logout

---

## Async State Requirements

For all important screens and operations, support:
- loading
- success
- error
- empty state

Minimum offline expectation:
- show previously loaded data if possible
- avoid blank failure when data was already available earlier

---

## Code Change Policy

Before changing code:
1. understand the feature and affected files
2. preserve project intent
3. avoid unnecessary rewrites
4. prefer small safe commits/changes
5. keep naming consistent

When proposing code:
- be explicit
- keep it implementable
- avoid fake placeholders unless clearly marked
- prefer complete working slices

---

## Prioritization Rules

Always prioritize in this order:
1. course requirements
2. working end-to-end flows
3. architecture cleanliness
4. UX clarity
5. polish
6. optional extras

If a choice must be made, choose the simpler solution that supports the demo and evaluation.

---

## Demo-First Mindset

The final app must be easy to demonstrate:
- full navigation
- CRUD
- persistence after restart
- API loading state
- API error state
- native permission flow
- handling permission refusal
- clear explanation of architecture and backend choice

Agents should keep this demo path in mind when implementing features.

---

## Recommended Build Order

1. navigation shell
2. theme and tokens
3. auth
4. remote data connection
5. list
6. create
7. detail
8. edit/delete
9. settings
10. geolocation
11. state resilience
12. visual polish

---

## Final Guardrails

Always ask:
- Does this help the required mobile app?
- Does this respect the chosen concept?
- Does this make the demo stronger?
- Is this simpler and more maintainable?
- Does this preserve the modern minimal design language?

If not, do not add it.