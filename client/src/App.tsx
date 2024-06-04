import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import AuthProvider from './misc/AuthProvider';
import Route from './route';

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });
  
  return (
    <QueryClientProvider client={queryClient} >
      <AuthProvider>
        <Route />
      </AuthProvider>
    </QueryClientProvider>
  )
};