import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { StoreProvider } from './data/store'
import { Admin } from './pages/Admin'
import { SignIn, SignUp } from './pages/Auth'
import { Confirmation } from './pages/Confirmation'
import { Home } from './pages/Home'
import { Marketplace } from './pages/Marketplace'
import { OrderDetail } from './pages/OrderDetail'
import { Orders } from './pages/Orders'
import { OutcomeForm } from './pages/OutcomeForm'
import { OutcomePage } from './pages/OutcomePage'
import { Dashboard } from './pages/SellerDashboard'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/outcome/:id" element={<OutcomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/outcomes/new"
              element={
                <ProtectedRoute role="seller">
                  <OutcomeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/outcomes/:id/edit"
              element={
                <ProtectedRoute role="seller">
                  <OutcomeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirmation/:orderId"
              element={
                <ProtectedRoute>
                  <Confirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
