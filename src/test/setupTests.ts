// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Firebase to avoid initialization errors
jest.mock('../services/firebase', () => ({
  auth: {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    updateProfile: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
  googleProvider: {},
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
    addDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
  },
}));

// Mock AuthContext to provide default values
jest.mock('../contexts/AuthContext', () => ({
  useAuthContext: () => ({
    user: null,
    loading: false,
    error: null,
    signIn: jest.fn().mockResolvedValue({ success: true }),
    signUp: jest.fn().mockResolvedValue({ success: true }),
    signInWithGoogle: jest.fn().mockResolvedValue({ success: true }),
    signOut: jest.fn().mockResolvedValue({ success: true }),
    sendPasswordReset: jest.fn().mockResolvedValue({ success: true }),
    updateProfile: jest.fn().mockResolvedValue({ success: true }),
    getIdToken: jest.fn().mockResolvedValue('mock-token'),
    clearError: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock React Router to avoid navigation issues
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ children }: { children: React.ReactNode }) => children,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

// Add polyfills for missing Node.js features
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock structuredClone if not available
if (!global.structuredClone) {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console warnings in tests unless needed
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      args[0]?.includes?.('Warning:') ||
      args[0]?.includes?.('punycode') ||
      args[0]?.includes?.('DEP0040')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
  
  console.warn = (...args: any[]) => {
    if (
      args[0]?.includes?.('componentWillReceiveProps') ||
      args[0]?.includes?.('punycode')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
}); 