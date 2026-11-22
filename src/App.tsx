import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ToastProvider } from './components/ui/Toast'
import AppShell from './layout/AppShell'

const Overview = lazy(() => import('./pages/Overview'))
const Orders = lazy(() => import('./pages/Orders'))
const Products = lazy(() => import('./pages/Products'))
const Customers = lazy(() => import('./pages/placeholders').then((m) => ({ default: m.Customers })))
const Analytics = lazy(() => import('./pages/placeholders').then((m) => ({ default: m.Analytics })))
const Settings = lazy(() => import('./pages/placeholders').then((m) => ({ default: m.Settings })))
const Foundation = lazy(() => import('./pages/Foundation'))
const Components = lazy(() => import('./pages/Components'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="foundation" element={<Foundation />} />
            <Route path="components" element={<Components />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
