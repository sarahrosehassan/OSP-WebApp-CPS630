// src/components/context/AuthContext.jsx
import { createContext } from 'react';

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
      
          const text = await response.text(); // 🔥 GET THE RAW TEXT FIRST
          console.log("🚀 RAW RESPONSE TEXT:", text);
      
          let result;
          try {
            result = JSON.parse(text); // 🔥 SAFELY PARSE
          } catch (e) {
            console.error("❌ Failed to parse JSON:", e);
            return { success: false, error: "Invalid JSON from server" };
          }
      
          console.log("✅ Parsed response:", result);
      
          if (result.success) {
            return { success: true };
          } else {
            return { success: false, error: result.message || "Signup failed" };
          }
        } catch (error) {
          console.error("❌ Fetch error:", error);
          return { success: false, error: "Network error or server is down" };
        }
      };
      
      

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost/osp_it1-2_cps630/backend/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // include cookies for sessions if needed
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network or server error.' };
    }
  };

  return (
    <AuthContext.Provider value={{ signup, login }}>
      {children}
    </AuthContext.Provider>
  );
};
