import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider } from './components/ui/provider.jsx';
import { AuthProvider } from '@context/AuthContext';
import { HomepageProvider } from './context/HomepageContext.jsx';
import { BrowserRouter } from 'react-router-dom'
import { EventTypeProvider } from './context/EventTypeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <BrowserRouter>
          <EventTypeProvider>
            <HomepageProvider>
              <App />
            </HomepageProvider>
          </EventTypeProvider>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </StrictMode>
)
