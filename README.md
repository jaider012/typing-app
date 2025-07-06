# LincType - Typing Speed Test App

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Chakra_UI-319795?style=for-the-badge&logo=chakraui&logoColor=white" alt="Chakra UI" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
</p>

## 📖 Descripción

**LincType** es una aplicación moderna de typing test construida con React y TypeScript. Permite a los usuarios mejorar su velocidad de escritura con tests personalizables, seguimiento de progreso y un sistema de leaderboard competitivo.

## ✨ Características Principales

### 🎯 **Core Features**
- ⌨️ **Tests de Escritura**: Múltiples modos (tiempo, palabras, citas)
- 📊 **Métricas en Tiempo Real**: WPM, precisión, errores
- 🎨 **Feedback Visual**: Colores dinámicos para caracteres correctos/incorrectos
- ⏱️ **Configuración Flexible**: Tests de 15s, 30s, 60s, 120s
- 🔄 **Reinicio Rápido**: Tab para reiniciar, Escape para cancelar

### 🔐 **Autenticación**
- 🔥 **Firebase Auth**: Login/registro seguro
- 👤 **Perfiles de Usuario**: Estadísticas personales
- 🔒 **Rutas Protegidas**: Contenido exclusivo para usuarios autenticados

### 🏆 **Sistema de Progreso**
- 📈 **Estadísticas Detalladas**: Historial de tests, mejores resultados
- 🥇 **Leaderboard Global**: Rankings por WPM, precisión y puntuación
- 🎯 **Sistema de Puntuación**: Algoritmo que considera velocidad, precisión y consistencia

### 🎨 **Experiencia de Usuario**
- 🌙 **Tema Oscuro**: Diseño moderno y cómodo para la vista
- 📱 **Responsive**: Adaptado para desktop y móvil
- ⚡ **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- 🎵 **Feedback Táctil**: Indicadores visuales y sonoros

## 🛠️ Tecnologías Utilizadas

### **Frontend Core**
- **React 18** - Biblioteca de UI con hooks modernos
- **TypeScript** - Tipado estático para mejor desarrollo
- **Vite** - Build tool rápido y moderno

### **UI/UX**
- **Chakra UI** - Biblioteca de componentes accesibles
- **Framer Motion** - Animaciones y transiciones
- **React Router** - Navegación SPA

### **Estado y Datos**
- **React Context** - Manejo de estado global
- **Custom Hooks** - Lógica reutilizable
- **Axios** - Cliente HTTP para API

### **Autenticación**
- **Firebase Auth** - Autenticación segura
- **JWT** - Tokens de acceso

### **Testing**
- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **Vitest** - Testing unitario rápido

## 🚀 Instalación y Configuración

### **Prerrequisitos**
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### **Instalación**
```bash
# Clonar el repositorio
git clone <repository-url>
cd linctype-front

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Firebase
```

### **Variables de Entorno**
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef

# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
```

## 🎮 Uso

### **Desarrollo**
```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Build para producción
npm run build

# Preview del build
npm run preview
```

### **Linting y Formateo**
```bash
# Ejecutar linter
npm run lint

# Formatear código
npm run format

# Verificar tipos TypeScript
npm run type-check
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── atoms/           # Componentes básicos
│   │   ├── ActionButton/
│   │   ├── Character/
│   │   ├── MotionBox/
│   │   ├── StatCard/
│   │   └── UserAvatar/
│   ├── molecules/       # Componentes compuestos
│   │   ├── LoginForm/
│   │   ├── SignUpForm/
│   │   ├── StatsBar/
│   │   ├── TestConfigBar/
│   │   └── Word/
│   ├── organisms/       # Componentes complejos
│   │   ├── AuthModal/
│   │   ├── Navigation/
│   │   ├── ProtectedRoute/
│   │   ├── TestResults/
│   │   └── TypingArea/
│   ├── pages/          # Páginas principales
│   │   ├── LeaderboardPage/
│   │   ├── ProfilePage/
│   │   └── TypingTestPage/
│   └── templates/      # Layouts
│       └── MainLayout/
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useHttp.ts
│   ├── useTimer.ts
│   ├── useTypingTest.ts
│   └── useUserStats.ts
├── services/           # Servicios externos
│   ├── api.ts
│   ├── firebase.ts
│   └── types.ts
├── types/              # Definiciones de tipos
│   ├── auth.ts
│   ├── settings.ts
│   ├── test.ts
│   └── user.ts
├── utils/              # Utilidades
│   ├── characterColor.ts
│   └── wordGenerator.ts
├── contexts/           # Context providers
│   └── AuthContext.tsx
└── theme/              # Configuración de tema
    └── index.ts
```

## 🧪 Testing

### **Ejecutar Tests**
```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests específicos
npm run test -- --testNamePattern="useTypingTest"
```

### **Cobertura de Tests**
- ✅ Custom hooks (useTypingTest, useAuth, useTimer)
- ✅ Componentes principales (TypingArea, TestResults)
- ✅ Utilidades (wordGenerator, characterColor)
- ✅ Servicios (API, Firebase)

## 🎯 Características Implementadas

### ✅ **Completadas**
- [x] Sistema de typing test con múltiples modos
- [x] Cálculo preciso de WPM y precisión
- [x] Autenticación con Firebase
- [x] Perfil de usuario con estadísticas
- [x] Leaderboard global con filtros
- [x] Diseño responsive con Chakra UI
- [x] Sistema de puntuación avanzado
- [x] Feedback visual en tiempo real
- [x] Guardado automático de resultados

### 🚧 **En Desarrollo**
- [ ] Modo competitivo multijugador
- [ ] Achievements y badges
- [ ] Configuraciones personalizadas
- [ ] Análisis detallado de errores
- [ ] Integración con redes sociales

### 💡 **Futuras Mejoras**
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Estadísticas avanzadas con gráficos
- [ ] Sistema de amigos
- [ ] Desafíos diarios
- [ ] Soporte para múltiples idiomas

## 🔧 Configuración Avanzada

### **Personalización de Tema**
```typescript
// src/theme/index.ts
export const customTheme = {
  colors: {
    primary: '#10ADE2',
    secondary: '#93C43F',
    error: '#F25151',
    // ... más colores
  },
  // ... más configuraciones
};
```

### **Configuración de Tests**
```typescript
// src/utils/wordGenerator.ts
export const testConfigurations = {
  time: [15, 30, 60, 120],
  words: [10, 25, 50, 100],
  difficulty: ['easy', 'medium', 'hard'],
};
```

## 🤝 Contribución

### **Proceso de Contribución**
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

### **Estándares de Código**
- Usar TypeScript estricto
- Seguir convenciones de naming
- Escribir tests para nuevas funcionalidades
- Mantener cobertura de tests > 80%
- Documentar componentes complejos

### **Reportar Bugs**
- Usar el template de issues
- Incluir pasos para reproducir
- Especificar navegador y versión
- Adjuntar screenshots si es necesario

## 📊 Métricas y Análisis

### **Performance**
- ⚡ **First Contentful Paint**: < 1.5s
- ⚡ **Time to Interactive**: < 3s
- ⚡ **Bundle Size**: < 500KB gzipped

### **Accesibilidad**
- ♿ **WCAG 2.1 AA** compliant
- ⌨️ **Keyboard Navigation** completo
- 🎨 **Color Contrast** optimizado

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto y Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/linctype-front/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/linctype-front/wiki)
- **Email**: tu-email@ejemplo.com

---

<p align="center">
  Hecho con ❤️ para la comunidad de typing enthusiasts
</p>
