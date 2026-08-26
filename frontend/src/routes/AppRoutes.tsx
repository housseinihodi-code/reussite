import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { Vehicles } from '@/pages/Vehicles';
import { VehicleDetails } from '@/pages/VehicleDetails';
import { Favorites } from '@/pages/Favorites';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Orders, OrderDetails } from '@/pages/Orders';
import { Profile } from '@/pages/Profile';
import { Contact } from '@/pages/Contact';
import { About } from '@/pages/About';
import { FAQ } from '@/pages/FAQ';
import { NotFound } from '@/pages/NotFound';
import { AdminDashboard, PendingVehicles, AdminUsers, OrdersAdmin, AdminCreateVehicle } from '@/pages/Admin';
import { SellerDashboard, CreateListing, EditListing } from '@/pages/Seller';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="vehicles/:slug" element={<VehicleDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="cart" element={<Cart />} />

        <Route element={<ProtectedRoute />}>
          <Route path="favorites" element={<Favorites />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="seller" element={<SellerDashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={['SELLER', 'ADMIN', 'SUPER_ADMIN']} />}>
          <Route path="seller/vehicles/new" element={<CreateListing />} />
          <Route path="seller/vehicles/:id/edit" element={<EditListing />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="vehicles/new" element={<AdminCreateVehicle />} />
          <Route path="vehicles/pending" element={<PendingVehicles />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<OrdersAdmin />} />
        </Route>
      </Route>
    </Routes>
  );
}
