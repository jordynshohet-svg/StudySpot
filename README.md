# StudySpot 📍

**Discover the best study spots on campus.**

StudySpot is a React Native Expo app (iOS-first) that helps university students find, rate, and share their favorite study locations. Inspired by Beli's clean, minimal design aesthetic.

## Features (MVP)

- 🗺️ **Map** — Interactive campus map showing study spots with ratings
- 🔍 **Explore** — Browse and filter spots by vibes, noise level, amenities
- ✨ **For You** — Personalized recommendations based on your study preferences
- 🔖 **Saved** — Bookmark your favorite spots for quick access
- ⭐ **Reviews** — Rate spots, share vibes, and help other students
- 👤 **Profile** — University-scoped .edu authentication

## Tech Stack

- **Framework:** React Native + Expo (SDK 51)
- **Language:** TypeScript (strict mode)
- **Navigation:** React Navigation 6 (native stack + bottom tabs)
- **State:** Zustand
- **Maps:** react-native-maps
- **Icons:** @expo/vector-icons (Ionicons)
- **Design:** Custom Beli-inspired minimal design system

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start

# Run on iOS simulator
npx expo start --ios
```

## Project Structure

```
src/
├── components/       # Shared UI components
│   ├── BusyIndicator.tsx
│   ├── RatingStars.tsx
│   ├── SpotCard.tsx
│   └── VibeTag.tsx
├── data/             # Mock data for development
│   ├── mockReviews.ts
│   └── mockSpots.ts
├── navigation/       # React Navigation setup
│   ├── MainTabNavigator.tsx
│   └── RootNavigator.tsx
├── screens/          # Screen components
│   ├── Auth/
│   ├── Explore/
│   ├── Map/
│   ├── Profile/
│   ├── Recommendations/
│   ├── Reviews/
│   ├── Saved/
│   └── SpotDetail/
├── stores/           # Zustand state management
│   ├── authStore.ts
│   ├── recommendationsStore.ts
│   ├── reviewsStore.ts
│   ├── savedStore.ts
│   └── spotsStore.ts
├── theme/            # Design tokens & theme
│   └── index.ts
└── types/            # TypeScript type definitions
    └── index.ts
```

## Design Principles

1. **Minimal & Clean** — Generous whitespace, purposeful typography
2. **iOS-First** — Native-feeling interactions, respects platform conventions
3. **Content-Forward** — Spots and reviews take center stage
4. **University-Scoped** — Each campus has its own community

## Authentication

StudySpot uses .edu email verification to ensure all users are verified university students. The app automatically detects the university from the email domain.

## License

Private — All rights reserved.
