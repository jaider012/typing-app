# Plan de Desarrollo - Typing Speed Test App

## 📋 Fase 1: Configuración del Proyecto

### Backend (NestJS + TypeORM)

- [ ] **Inicialización del proyecto**

  - Crear proyecto NestJS con TypeScript
  - Configurar TypeORM con base de datos (PostgreSQL/MySQL)
  - Configurar variables de entorno
  - Configurar Docker para desarrollo

- [ ] **Configuración de autenticación**

  - Instalar Passport, JWT, bcrypt
  - Configurar JWT strategy
  - Crear guards para protección de rutas
  - Implementar refresh tokens

- [ ] **Modelos de datos**

  ```typescript
  User {
    id, email, username, password, createdAt, updatedAt
  }

  Test {
    id, userId, wpm, accuracy, score, wordsTyped,
    timeSpent, mistakes, text, createdAt
  }

  Leaderboard {
    id, userId, bestWpm, bestAccuracy, bestScore,
    totalTests, updatedAt
  }
  ```

### Frontend (React + TypeScript)

- [ ] **Configuración inicial**

  - Crear proyecto con Vite + React + TypeScript
  - Configurar Tailwind CSS
  - Instalar Framer Motion
  - Configurar Zustand o Context API para estado global
  - Configurar React Router

- [ ] **Estructura de carpetas**
  ```
  src/
  ├── components/
  ├── hooks/
  ├── pages/
  ├── store/
  ├── types/
  ├── utils/
  └── services/
  ```

## 🎯 Fase 2: Funcionalidades Core

### Typing Test Engine

- [ ] **Componente principal TypingTest**

  - Input handler sin mostrar caracteres
  - Timer de 2 minutos
  - Generador de texto aleatorio
  - Detección de inicio automático

- [ ] **Sistema de feedback visual**

  - Caracteres verdes (#93C43F) para correctos
  - Caracteres rojos (#F25151) para incorrectos
  - Subrayado azul (#10ADE2) para siguiente carácter
  - Animaciones suaves con Framer Motion

- [ ] **Cálculos en tiempo real**
  - WPM que inicie al empezar a escribir
  - Accuracy tracking
  - Contador de errores/deletes
  - Score = (WPM _ Words Typed _ Accuracy) - Deletes

### Hooks Personalizados

- [ ] **useTypingTest**

  ```typescript
  const {
    currentText,
    userInput,
    wpm,
    accuracy,
    timeLeft,
    isActive,
    isCompleted,
    handleInput,
    resetTest,
    startTest,
  } = useTypingTest();
  ```

- [ ] **useTimer**

  ```typescript
  const { timeLeft, isActive, start, pause, reset } = useTimer(120);
  ```

- [ ] **useKeyboard**
  ```typescript
  const { handleKeyDown, mistakes, correctChars } =
    useKeyboard(onCharacterTyped);
  ```

## 🎨 Fase 3: UI/UX y Animaciones

### Componentes Reutilizables

- [ ] **Button Component**

  - Variantes (primary, secondary, danger)
  - Estados hover/focus con Motion
  - Loading states

- [ ] **TypingArea Component**

  - Display del texto con highlighting
  - Cursor animado
  - Smooth transitions

- [ ] **StatsCard Component**
  - Mostrar WPM, Accuracy, Score
  - Animaciones de números incrementales
  - Gráficos simples con recharts

### Animaciones con Framer Motion

- [ ] **Transiciones de página**

  - Page transitions suaves
  - Stagger animations para listas
  - Loading skeletons

- [ ] **Micro-interacciones**
  - Feedback táctil en botones
  - Pulse animations para errores
  - Success celebrations al completar

## 🔐 Fase 4: Autenticación y Perfil

### Sistema de Auth

- [ ] **Páginas de autenticación**

  - Login/Register forms
  - Validación con react-hook-form + zod
  - Manejo de errores

- [ ] **Perfil de usuario**
  - Dashboard con estadísticas
  - Histórico de tests
  - Configuraciones personales

### API Integration

- [ ] **Servicio de API**

  ```typescript
  class ApiService {
    auth: AuthService;
    tests: TestService;
    users: UserService;
    leaderboard: LeaderboardService;
  }
  ```

- [ ] **Manejo de estados**
  - Loading states
  - Error boundaries
  - Retry mechanisms

## 📊 Fase 5: Features Avanzadas

### Sistema de Puntuación

- [ ] **Leaderboard global**

  - Top WPM, Accuracy, Score
  - Filtros por tiempo (día/semana/mes)
  - Animaciones de rankings

- [ ] **Progreso personal**
  - Gráficos de mejora
  - Achievements/badges
  - Streak tracking

### Configuraciones

- [ ] **Personalización**
  - Temas (dark/light mode)
  - Configuración de texto
  - Sonidos (opcional)

## 🧪 Fase 6: Testing

### Frontend Testing

- [ ] **Unit Tests con Vitest**

  - Custom hooks testing
  - Component behavior testing
  - Utility functions testing

- [ ] **Integration Tests**
  - User flows completos
  - API integration tests
  - E2E con Playwright

### Backend Testing

- [ ] **Unit Tests con Jest**
  - Service layer testing
  - Controller testing
  - Authentication flow testing

## 🚀 Fase 7: Deployment y Optimización

### Performance

- [ ] **Optimizaciones frontend**

  - Code splitting
  - Lazy loading
  - Image optimization
  - Bundle analysis

- [ ] **Optimizaciones backend**
  - Database indexing
  - Query optimization
  - Caching con Redis

### Deployment

- [ ] **Docker containerization**
- [ ] **CI/CD pipeline**
- [ ] **Monitoring y logs**

## 🔗 Ideas para Webhooks

### 1. Sistema de Notificaciones

```typescript
// Cuando alguien supera tu record
webhook: "user_record_beaten"
payload: {
  userId: "123",
  previousRecord: 85,
  newRecord: 92,
  beatByUser: "john_doe"
}
```

### 2. Achievements System

```typescript
// Al desbloquear logros
webhook: "achievement_unlocked"
payload: {
  userId: "123",
  achievement: "speed_demon", // 100+ WPM
  unlockedAt: "2025-07-04T10:00:00Z"
}
```

### 3. Daily Challenges

```typescript
// Completar desafío diario
webhook: "daily_challenge_completed"
payload: {
  userId: "123",
  challengeId: "daily_2025_07_04",
  score: 1250,
  rank: 15
}
```

### 4. Social Features

```typescript
// Seguir progreso de amigos
webhook: "friend_milestone_reached"
payload: {
  userId: "123",
  friendId: "456",
  milestone: "1000_tests_completed"
}
```

### 5. Integración con Discord/Slack

```typescript
// Enviar estadísticas a canales
webhook: "weekly_stats_summary"
payload: {
  userId: "123",
  weeklyStats: {
    testsCompleted: 25,
    avgWpm: 78,
    improvement: "+5 WPM"
  }
}
```

### 6. Moderación Automática

```typescript
// Detectar posibles trampas
webhook: "suspicious_activity_detected"
payload: {
  userId: "123",
  reason: "impossible_wpm_jump",
  details: { previousBest: 60, currentTest: 150 }
}
```

## 📁 Estructura Final del Proyecto

```
typing-app/
│   ├── frontend/          # React app
│   └── backend/           # NestJS API
├── docker-compose.yml
└── README.md
```

## ⏱️ Timeline Estimado

- **Fase 1-2**: 1-2 semanas (Setup + Core)
- **Fase 3-4**: 1-2 semanas (UI + Auth)
- **Fase 5**: 1 semana (Features avanzadas)
- **Fase 6-7**: 1 semana (Testing + Deploy)

**Total**: 4-6 semanas para MVP completo
