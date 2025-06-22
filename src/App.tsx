import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginForm from './features/auth/components/LoginForm';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import Layout from './Layout';
import Dashboard from '@/features/ui/Dashboard';
import { ProtectedRoute } from './features/auth/components/ProtectectedRoute';

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <LoginForm /> },
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {path: 'login',
          element: (<LoginForm />)
        }
      ],
    },
  ]);

  return (
    <div className="App">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {/* <span className="ripple"></span> */}
    </div>
  );
}
