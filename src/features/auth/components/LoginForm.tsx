import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  // useLocation gives us access to the page the user was attempting to access without being logged in
  // We'll use this to redirecto the user after they've been authenticated. '/dashboard' is our fallback.
  const from = location.state?.from?.pathname || '/dashboard';

useEffect(()=>{
  if (isAuthenticated) navigate(from, { replace: true });
})


  // All the business logic is in the AuthContext
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // You can follow useAuth to see the logic being used there with our mockUsers array
      const result = await login(email, password);

      if (result.success) {
        //pop up notification using react-hot-toast
        toast.success('Welcome back!');
        // navigate to our stored value from earlier
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || 'Login failed'); // Provide an error message if we have one. Otherwise use a fallback.
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // This form has:
  // A header
  // A div for the demo credentials login
  // the form groups for email and password
  // Submit button

  return (
    <div style={styles.loginContainer}>
      <form onSubmit={handleSubmit} style={styles.loginForm}>
        <h2>Earthquake Tracker Login</h2>
        <div className="demoCredentials">
          <p>Demo Credentials:</p>
          <code>user@example.com / user</code>
          <p></p> {/* ugly, i know. I'll do proper styling later */}
          <code>admin@example.com / admin</code>
        </div>
        <div className="formGroup">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            disabled={isLoading}
            autoComplete="email"
            placeholder="email"
          />
          <div className="formGroup">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              disabled={isLoading}
              autoComplete="password"
              placeholder='password'
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
// rgba(29, 28, 48, .5)
const styles = {
  loginContainer: {
    background: '#1d1c30',
    backgroundImage: `radial-gradient(circle at 50% 250%,red, transparent)`,
    width: '425px',
    aspectRatio: '2/1',
    padding: '1.5rem',
    borderRadius: '10px',
    border: "1px solid rgba(123, 112, 112, 0.75) "
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '2rem',
  },
};
