# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a typing speed test application called "LINCtype" with the following structure:

```
typing-app/
├── README.md                    # Development plan and project overview
├── linctype-front/             # React frontend application
│   ├── src/
│   │   ├── App.tsx             # Main typing test component
│   │   ├── calculateScore.ts   # Score calculation utility
│   │   └── test/               # Test files
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.ts
└── back-typing-app/            # NestJS backend application
    ├── src/
    │   ├── auth/               # Firebase authentication
    │   ├── config/             # Configuration files
    │   ├── firebase/           # Firebase Admin SDK integration
    │   ├── users/              # User management
    │   ├── typing/              # Typing test management
    │   ├── leaderboard/        # Leaderboard functionality
    │   ├── app.module.ts       # Main application module
    │   └── main.ts             # Application entry point
    ├── .env.example            # Environment variables template
    ├── package.json
    └── tsconfig.json
```

## Development Commands

### Frontend (linctype-front directory)

**Install dependencies:**
```bash
cd linctype-front && npm install
```

**Start development server:**
```bash
npm start
```
Opens at http://localhost:3000

**Start JSON Server (mock backend):**
```bash
npm run json-server
```
Serves db.json file for API simulation

**Run tests:**
```bash
npm test
```
Uses Jest with jsdom environment

**Build for production:**
```bash
npm run build
```

### Backend (back-typing-app directory)

**Install dependencies:**
```bash
cd back-typing-app && npm install
```

**Start development server:**
```bash
npm run start:dev
```
Opens at http://localhost:3001 with API prefix `/api`

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm run start:prod
```

**Run tests:**
```bash
npm test
```

**Run linting:**
```bash
npm run lint
```

## Architecture Overview

### Current Implementation
- **Frontend**: React 18 with TypeScript
- **Backend**: NestJS with Firebase Admin SDK
- **Authentication**: Firebase Auth with JWT tokens
- **Database**: Firestore (NoSQL document database)
- **State Management**: React hooks (useState, useEffect)
- **Styling**: CSS with custom classes
- **Testing**: Jest with @testing-library/react (frontend), Jest (backend)
- **Build Tool**: Create React App (frontend), NestJS CLI (backend)

### Key Components

**Frontend:**
- `App.tsx`: Main component handling typing test logic including WPM calculation, word tracking, and user input
- `calculateScore.ts`: Utility function for score calculation based on words typed, WPM, accuracy, and first-strike accuracy

**Backend:**
- `FirebaseService`: Firebase Admin SDK integration for authentication and Firestore operations
- `FirebaseAuthGuard`: Authentication guard for protected routes using Firebase tokens
- `UsersController/Service`: User profile management and statistics
- `TestsController/Service`: Typing test results storage and retrieval
- `LeaderboardController/Service`: Global leaderboards for WPM, accuracy, and scores

### Score Calculation Formula
Score = words × (wpm / 60) × accuracy × firstStrikeAccuracy × 10

### Current Features
- Basic typing test with fixed sentence
- Real-time word highlighting
- WPM calculation based on character count
- Word-by-word input validation
- Simple completion feedback

### Future Development Plans
The root README.md contains a comprehensive development plan including:
- Backend with NestJS + TypeORM
- Enhanced frontend with animations (Framer Motion)
- User authentication and profiles
- Leaderboard system
- Advanced scoring and analytics
- Webhook integrations for notifications

## TypeScript Configuration

- Target: ES5 with modern library support
- Strict mode enabled
- JSX: react-jsx
- Module resolution: Node.js style
- Isolated modules disabled for compatibility

## Testing Setup

- Jest with ts-jest preset
- jsdom environment for DOM testing
- CSS modules mocked via styleMock.ts
- Coverage collection from src/**/*.{ts,tsx}

## Development Notes

- The app uses a simple word-by-word matching system
- Timer starts when user begins typing
- Input is trimmed and compared against current word
- WPM calculated as (characters typed / 5) / (time in minutes)
- No character-level accuracy tracking in current implementation

## Backend API Endpoints

### Authentication Required Endpoints
All endpoints require Firebase JWT token in Authorization header: `Bearer <token>`

**Users:**
- `GET /api/users/profile` - Get current user profile

**Tests:**
- `POST /api/tests` - Submit typing test result
- `GET /api/tests` - Get user's typing test history (supports ?limit=N)
- `GET /api/tests/stats` - Get user's statistics

**Leaderboards (Public):**
- `GET /api/leaderboard/wpm` - Top WPM leaderboard
- `GET /api/leaderboard/accuracy` - Top accuracy leaderboard
- `GET /api/leaderboard/score` - Top score leaderboard

## Environment Configuration

### Backend (.env file required)
```
FIREBASE_SERVICE_ACCOUNT=<Firebase service account JSON>
FIREBASE_DATABASE_URL=<Firebase database URL>
PORT=3001
JWT_SECRET=<JWT secret key>
```

## Firebase Setup Requirements

1. Create Firebase project
2. Enable Authentication
3. Enable Firestore Database
4. Generate service account key
5. Configure Firestore collections:
   - `tests` - Individual test results
   - `userStats` - Aggregated user statistics

## Data Models

### Test Result
```typescript
{
  uid: string;
  wpm: number;
  accuracy: number;
  score: number;
  wordsTyped: number;
  timeSpent: number;
  mistakes: number;
  text: string;
  createdAt: string;
}
```

### User Stats
```typescript
{
  totalTests: number;
  bestWpm: number;
  bestAccuracy: number;
  bestScore: number;
  averageWpm: number;
  averageAccuracy: number;
  updatedAt: string;
}
```