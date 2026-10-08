import { BrowserRouter } from 'react-router-dom';
import AssistantWidget from './components/feature/AssistantWidget';
import ScrollManager from './components/feature/ScrollManager';
import SiteAccessGate from './components/feature/SiteAccessGate';
import { AppRoutes } from './router';

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <ScrollManager />
      <SiteAccessGate>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-background-50"
        >
          Skip to main content
        </a>
        <AppRoutes />
        <AssistantWidget />
      </SiteAccessGate>
    </BrowserRouter>
  );
}

export default App;
