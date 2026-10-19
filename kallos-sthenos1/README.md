# Kallos Sthenos

Calisthenics mastery, precision sports nutrition and joint longevity. React 19 + TypeScript + Vite + Tailwind CSS. 100% client side, all data saved in localStorage.

## Run locally
```
npm install
npm run dev
```

## Deploy on Render (Static Site)
1. Push this folder to a GitHub repo.
2. Render → New → Static Site → pick the repo.
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. If the project sits inside a subfolder of the repo, set Root Directory to that folder.

No environment variables or server needed.

## localStorage keys
`kallos_user_profile`, `kallos_workout_schedule`, `kallos_meal_plan`, `kallos_completed_sessions`, `kallos_benchmark_log`

## Where things live
- `src/data/` exercises (120), foods, skills ladders, rehab protocols
- `src/lib/` nutrition maths, meal plan solver, workout generator, level system
- `src/views/` one file per tab (lazy loaded so first paint stays fast)

## Photos
Stock photos are free Unsplash images (unsplash.com/license) loaded from Unsplash's CDN. All IDs live in `src/data/images.ts`. Swap any ID there to change a photo. Images lazy load, are sized per screen, and fall back to a dark gradient if one fails.
