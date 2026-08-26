import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '@/redux/store';
import { AuthProvider } from '@/context/AuthContext';
import { AppRoutes } from '@/routes';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3500} theme="colored" />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}
