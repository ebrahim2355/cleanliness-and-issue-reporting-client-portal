import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Root from './layouts/Root.jsx'
import Home from './pages/Home/Home.jsx'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './contexts/AuthProvider.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import Issues from './pages/Issues/Issues.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
import IssueDetails from './pages/IssueDetails/IssueDetails.jsx'
import AllIssues from './pages/AllIssues/AllIssues.jsx'
import AddIssue from './pages/AddIssue/AddIssue.jsx'
import MyIssues from './pages/MyIssues/MyIssues.jsx'
import MyContribution from './pages/MyContribution/MyContribution.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "issues",
        Component: Issues,
      },
      {
        path: "/issues/:id",
        element: <PrivateRoute><IssueDetails></IssueDetails></PrivateRoute>
      },
      {
        path: "all-issues",
        element: <PrivateRoute><AllIssues></AllIssues></PrivateRoute>
      },
      {
        path: "add-issue",
        element: <PrivateRoute><AddIssue></AddIssue></PrivateRoute>
      },
      {
        path: "my-issues",
        element: <PrivateRoute><MyIssues></MyIssues></PrivateRoute>
      },
      {
        path: "my-contribution",
        element: <PrivateRoute><MyContribution></MyContribution></PrivateRoute>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  </StrictMode>,
)
