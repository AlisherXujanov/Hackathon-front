# UnitSchool - Learning Platform Frontend

A comprehensive learning platform built with Next.js 15, Tailwind CSS, and React.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── password-reset/
│   ├── profile/           # User profile page
│   ├── english/           # English learning pages
│   │   ├── grammar/
│   │   ├── reading/
│   │   ├── writing/
│   │   ├── listening/
│   │   └── vocabulary/
│   ├── programming/       # Programming/IT pages
│   │   ├── tasks/
│   │   └── sandbox/
│   ├── classes/           # Class management pages
│   │   └── [id]/
│   ├── leaderboard/       # Leaderboard page
│   ├── analytics/         # Analytics page
│   └── ai/                # AI conversation page
│       └── conversation/
├── assets/                # Static assets
│   ├── images/           # Image files
│   ├── icons/            # Custom icons
│   └── styles/           # SCSS styles
│       └── _settings.scss
├── locales/              # i18n translations
│   ├── en/               # English translations
│   ├── ru/               # Russian translations
│   └── uz/               # Uzbek translations
└── store/                # State management
    ├── context.js        # React Context
    └── data.json         # Single-source-of-truth JSON data
```

## Features

- **Authentication**: Login, Register, Password Reset
- **Profile Management**: User profile with tabs (Overview, Progress, Achievements, Settings)
- **English Learning**: Grammar, Reading, Writing, Listening, Vocabulary
- **Programming**: Tasks and Code Sandbox
- **Classes**: Class management and student tracking
- **Leaderboard**: Daily, Weekly, Monthly rankings
- **Analytics**: Learning progress and activity tracking
- **AI Assistant**: Writing, Grammar, and Coding assistance

## Technologies

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- React Icons
- Axios (for API calls)
- Framer Motion (for animations)
- i18n support (en, ru, uz)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Notes

- All pages are frontend-only (no backend integration yet)
- Components will be created later as mentioned in the plan
- i18n translations are set up but not fully integrated (ready for integration)
- Store context is set up for future state management
