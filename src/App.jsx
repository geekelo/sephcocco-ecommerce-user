

import { ErrorBoundary } from './components/ErrorBoundary'
import SplashScreen from './components/SplashScreen'

function App() {

return (
  <ErrorBoundary>
      <SplashScreen />
    </ErrorBoundary>
)
}

export default App
