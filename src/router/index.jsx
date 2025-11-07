import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";

// Lazy load page components
const Home = lazy(() => import("@/components/pages/Home"));
const Products = lazy(() => import("@/components/pages/Products"));
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"));
const Checkout = lazy(() => import("@/components/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/components/pages/OrderConfirmation"));
const UserProfile = lazy(() => import("@/components/pages/UserProfile"));
const Wishlist = lazy(() => import("@/components/pages/Wishlist"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<PageLoader />}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "products",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Products />
      </Suspense>
    )
  },
  {
    path: "product/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProductDetail />
      </Suspense>
    )
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Checkout />
      </Suspense>
    )
  },
{
    path: "order-confirmation",
    element: (
      <Suspense fallback={<PageLoader />}>
        <OrderConfirmation />
      </Suspense>
    )
  },
  {
    path: "profile",
    element: (
      <Suspense fallback={<PageLoader />}>
        <UserProfile />
      </Suspense>
    )
},
{
    path: "wishlist",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Wishlist />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    )
  }
];

// Create routes array
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

// Export router
export const router = createBrowserRouter(routes);