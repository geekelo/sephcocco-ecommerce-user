import { lazy } from "react";

export const OutletPage  = lazy(() => import("../pages/Outlet"));
export const ProductPage = lazy(() => import("../pages/Product"));
export const PendingOrders = lazy(() => import("../pages/PendingOrders"));
export const CompletedOrders = lazy(() => import("../pages/CompletedOrders"));
export const OrderDetails = lazy(() => import("../pages/OrderDetails"));


