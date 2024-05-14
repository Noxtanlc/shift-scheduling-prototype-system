import './App.css';
import AuthProvider from './hook/AuthProvider';
import Route from './route';

export default function App() {
  return (
    <AuthProvider>
      <Route />
    </AuthProvider>
  )
};