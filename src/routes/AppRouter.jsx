import { Suspense, useState, } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CompletedOrders, Messages, OrderDetails, OutletPage, PendingOrders, ProductPage } from "./LazyLoader";
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
        <ErrorBoundary showError={true}>
          {loading ? (
            <SplashScreen onComplete={handleSplashComplete} />
          ) : (
            <Suspense fallback={<SplashScreen />}>
              <Routes>
                <Route path="/" element={<OutletPage />} />
                <Route element={<HomeLayout />}>
                  <Route path="products" element={<ProductPage />} />
                  <Route path="pending-orders" element={<PendingOrders />} />
                  <Route path="completed-orders" element={<CompletedOrders />} />
                  <Route path="order/:orderId" element={<OrderDetails />} />
                  <Route path="messages" element={<Messages />} />
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