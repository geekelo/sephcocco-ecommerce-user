import { Suspense, useState, } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OutletPage, ProductPage } from "./LazyLoader";
import HomeLayout from "../layout/homeLayout";
import {ErrorBoundary} from '../components/ErrorBoundary'
import { SplashScreen } from "../components/SplashScreen";



const AppRouter = () => {
    const [loading, setLoading] = useState(true);
 
    

    const handleSplashComplete = () => {
      setLoading(false);
    };
    
    return (
      <BrowserRouter>
        <ErrorBoundary>
          {loading ? (
            <SplashScreen onComplete={handleSplashComplete} />
          ) : (
            <Suspense fallback={<SplashScreen />}>
              <Routes>
                <Route path="/" element={<OutletPage />} />
                <Route element={<HomeLayout />}>
                  <Route path="products" element={<ProductPage />} />
                </Route>
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          )}
        </ErrorBoundary>
      </BrowserRouter>
    );
  };

export default AppRouter;