'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, DeliveryAddress, UserProfile } from '../types';

interface AuthContextType {
  // Customer State
  customer: UserProfile | null;
  user: UserProfile | null;
  customerPhone: string;
  isLoggedIn: boolean;
  loginCustomer: (phone: string, name?: string) => Promise<UserProfile>;
  login: (phone: string, name?: string, email?: string) => Promise<UserProfile>;
  logoutCustomer: () => void;
  logout: () => void;
  saveAddress: (address: DeliveryAddress) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;

  // Admin State
  adminUser: AdminUser | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CUSTOMER_STORAGE_KEY = 'tcc_customer_session';
const ADMIN_STORAGE_KEY = 'tcc_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<UserProfile | null>(null);
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedCust = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (savedCust) {
        const parsed = JSON.parse(savedCust);
        setCustomer(parsed);
        setCustomerPhone(parsed.phone);
      }

      const savedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        setAdminUser(parsed.user);
        setAdminToken(parsed.token);
      }
    } catch (e) {
      console.warn('Failed loading auth storage', e);
    }
  }, []);

  const loginCustomer = async (phone: string, name?: string): Promise<UserProfile> => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    try {
      const res = await fetch(`/api/user/profile?phone=${cleanPhone}`);
      const data = await res.json();
      let profile: UserProfile;
      if (data.success && data.data) {
        profile = data.data;
        if (name && profile.name === 'Guest Customer') {
          profile.name = name;
        }
      } else {
        profile = {
          id: `usr-${Date.now()}`,
          name: name || 'Valued Guest',
          phone: cleanPhone,
          savedAddresses: [],
          favoriteProductIds: [],
          createdAt: new Date().toISOString(),
        };
      }
      setCustomer(profile);
      setCustomerPhone(cleanPhone);
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch {
      const fallback: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name || 'Valued Guest',
        phone: cleanPhone,
        savedAddresses: [],
        favoriteProductIds: [],
        createdAt: new Date().toISOString(),
      };
      setCustomer(fallback);
      setCustomerPhone(cleanPhone);
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  };

  const logoutCustomer = () => {
    setCustomer(null);
    setCustomerPhone('');
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
  };

  const saveAddress = async (address: DeliveryAddress) => {
    if (!customerPhone) return;
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerPhone,
          action: 'save-address',
          address,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCustomer(data.data);
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(data.data));
      }
    } catch (e) {
      console.error('Error saving address:', e);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!customerPhone) {
      // Create guest profile if not logged in
      const defaultPhone = '9999999999';
      await loginCustomer(defaultPhone, 'Guest');
    }

    const currentPhone = customerPhone || '9999999999';
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentPhone,
          action: 'toggle-favorite',
          productId,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCustomer((prev) =>
          prev ? { ...prev, favoriteProductIds: data.data } : null
        );
      }
    } catch (e) {
      console.error('Error toggling favorite:', e);
    }
  };

  const isFavorite = (productId: string) => {
    return customer?.favoriteProductIds?.includes(productId) || false;
  };

  // ADMIN AUTH
  const loginAdmin = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminUser(data.user);
        setAdminToken(data.token);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch {
      return { success: false, error: 'Network error during login' };
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        user: customer,
        customerPhone,
        isLoggedIn: !!customerPhone,
        loginCustomer,
        login: (phone: string, name?: string, email?: string) => loginCustomer(phone, name),
        logoutCustomer,
        logout: logoutCustomer,
        saveAddress,
        toggleFavorite,
        isFavorite,
        adminUser,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
