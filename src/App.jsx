

import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary'
import SplashScreen from './components/SplashScreen'
import OutletPage from './pages/Outlet';

function App() {
  const [loading, setLoading] = useState(true);

  // Complete splash screen and show main content
  const handleSplashComplete = () => {
    setLoading(false);
  };
return (
  <div>
      {loading && (
          <ErrorBoundary>
    <SplashScreen onComplete={handleSplashComplete} />
          </ErrorBoundary>
    
      )}
      
      {!loading &&   <ErrorBoundary><OutletPage /></ErrorBoundary> }
    </div>

)
}

export default App
