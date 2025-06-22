import { type AuthState, type User } from '@types/types'
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

// ? Revist for understanding
interface AuthContextType extends AuthState {
  // This includes user, isAuthenticated, and isLoading from the parent type
  // Then we add some additional methods

  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
// Why undefined?
// - Catches Provider Mistakes Early
// - No mock functions for default context
// - Type Safety without null checks
// - Clear Error messages
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'user',
    role: 'user' as const, //protects against authorization issues
    name: 'Demo User',
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: 'admin',
    role: 'admin' as const,
    name: 'Demo Admin',
  },
    {
    id: '3',
    email: 'dimarziosmusic@gmail.com',
    password: '111',
    role: 'user' as const, //protects against authorization issues
    name: 'Eric',
  },
];
// Notice we're using a function declaration instead of an arrow function. This is a good practice for react components for a few reasons.
// Declaration are processed during compilatin. Initialization (processing the values) doesn't happen until code executes
// - Hoisting behavior: Allows you to use {children} prop to pass components
// - Better Stack Traces (following errors)
// - React documentation recommends function declaration for components. There are some industry trends moving towards arrow functions for consistency - example AirBnB
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing login on mount

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('det-user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          // ? Optional: Validate token with backend
          // const isValid = await validateToken(user.token);

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth check failed: ', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };
    checkAuth();
  }, [authState.isAuthenticated]);

  // No useCallback needed - function is stable. Would be overkill in this case
  const login = async (email: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ? Object.find method
      const foundUser = MOCK_USERS.find(
        (record) => record.email === email && record.password === password
      );
      if (foundUser) {
        const user: User = {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
          name: foundUser.name,
        };
        localStorage.setItem('det-user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        // We can return anything we want. In this case we're returning an object with the key 'success' and the value of a boolean.
        return { success: true };
      }
      return { succes: false, error: 'Invalid credentials' };
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('det-user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Memoize the context value to prevent unnecesarry re-renders
  const value = useMemo(
    () => ({ ...authState, login, logout }),
    [authState] // login and logout are stable
  );

  // Remember, this is all inside the AuthProvider component
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook with built-in error handling
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('userAuth must be used within an AuthProvider');
  }
  return context;
}