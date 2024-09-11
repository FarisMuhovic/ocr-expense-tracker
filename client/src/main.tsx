import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import "./index.css"
import RootLayout from "./layouts/rootlayout"
import PublicLayout from "./layouts/publicLayout"
import ProtectedLayout from "./layouts/protectedLayout"
import Login from "./pages/login"
import Register from "./pages/register"
import Dashboard from "./pages/dashboard"
import Subscriptions from "./pages/subscriptions"
import Transactions from "./pages/transactions"
import Settings from "./pages/settings"
import NotFound from "./pages/notFound"

const router = createBrowserRouter([
  {
    element: <PublicLayout />, // Routes for public pages
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    element: <ProtectedLayout />, // Protect these routes with JWT auth
    children: [
      {
        element: <RootLayout />, // Layout for the dashboard with sidebar
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/transactions",
            element: <Transactions />,
          },
          {
            path: "/subscriptions",
            element: <Subscriptions />,
          },
          {
            path: "/settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
