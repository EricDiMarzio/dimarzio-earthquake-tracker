import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
        }}
      />
    </div>
  );
}
