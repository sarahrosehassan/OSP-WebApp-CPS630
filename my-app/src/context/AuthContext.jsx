// components/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const signup = async (formData) => {
    try {
      const response = await fetch('http://localhost/osp_it1-2_cps630/backend/api/signup.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      return result.success
        ? { success: true }
        : { success: false, error: result.error || 'Signup failed' };
    } catch (error) {
      return { success: false, error: 'Network or server error' };
    }
  };

  const login = async (formData) => {
    try {
      const response = await fetch('http://localhost/osp_it1-2_cps630/backend/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.user); // if your backend returns user data
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network or server error' };
    }
  };

  return (
    <AuthContext.Provider value={{ signup, login, user }}>
      {children}
    </AuthContext.Provider>
  );
};
