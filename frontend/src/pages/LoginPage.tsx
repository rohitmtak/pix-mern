import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import apiClient from "@/utils/apiClient";
import axios from "axios";
import { showToast, toastMessages } from "@/config/toastConfig";
import { config } from "@/config/env";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { migrateGuestWishlist } = useWishlist();
  const { migrateGuestCartToUser } = useCart();
  const { isAuthenticated, checkAuth } = useAuth();

  const [authMode, setAuthMode] = useState<"Login" | "Sign Up">("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Basic client-side validation
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedEmail)) {
        showToast.error(toastMessages.auth.invalidEmail);
        return;
      }

      if (authMode === "Sign Up" && trimmedPassword.length < 8) {
        showToast.error(toastMessages.auth.passwordTooShort);
        return;
      }

      // Enhanced password validation for sign up
      if (authMode === "Sign Up") {
        const passwordErrors = [];
        
        if (trimmedPassword.length < 8) {
          passwordErrors.push('At least 8 characters');
        }
        if (!/[A-Z]/.test(trimmedPassword)) {
          passwordErrors.push('One uppercase letter');
        }
        if (!/[a-z]/.test(trimmedPassword)) {
          passwordErrors.push('One lowercase letter');
        }
        if (!/[0-9]/.test(trimmedPassword)) {
          passwordErrors.push('One number');
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmedPassword)) {
          passwordErrors.push('One special character');
        }
        
        if (passwordErrors.length > 0) {
          showToast.error(`Password must have: ${passwordErrors.join(', ')}`);
          return;
        }
      }

      if (authMode === "Sign Up" && name.trim().length < 2) {
        showToast.error(toastMessages.auth.nameRequired);
        return;
      }

      const endpoint = `${config.api.baseUrl}/user/${authMode === "Sign Up" ? "register" : "login"}`;
      const payload = authMode === "Sign Up" ? { name: name.trim(), email: trimmedEmail, password: trimmedPassword } : { email: trimmedEmail, password: trimmedPassword };
      const response = await apiClient.post(endpoint, payload);

      if (response.data?.success) {
        // Get current guest cart before migration
        const savedCart = localStorage.getItem('cart') || '[]';
        let guestCart = [];
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            guestCart = parsedCart;
          } else if (parsedCart.items && Array.isArray(parsedCart.items)) {
            guestCart = parsedCart.items;
          }
        } catch (error) {
          console.error('Error parsing guest cart:', error);
          guestCart = [];
        }
        
        // Migrate guest wishlist and cart to authenticated account
        try {
          await Promise.all([
            migrateGuestWishlist(),
            migrateGuestCartToUser(guestCart)
          ]);
          
          // Show single, appropriate message based on auth mode
          if (authMode === "Sign Up") {
            // New user - show welcome message with wishlist info
            showToast.success(toastMessages.auth.welcomeNewUser);
          } else {
            // Existing user - show login success with wishlist info
            showToast.success(toastMessages.auth.welcomeBackUser);
          }
        } catch (error) {
          console.error('Failed to migrate guest data:', error);
          
          // Show message without wishlist info if migration fails
          if (authMode === "Sign Up") {
            showToast.success(toastMessages.auth.welcomeNewUserFallback);
          } else {
            showToast.success(toastMessages.auth.welcomeBackUserFallback);
          }
        }
        
        // Small delay to ensure cart migration completes before navigation
        // This prevents race conditions with other components loading the cart
        setTimeout(async () => {
          // Refresh authentication state after successful login
          await checkAuth();
          navigate("/");
        }, 2000);
      } else {
        showToast.error(response.data?.message || toastMessages.general.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || toastMessages.auth.requestFailed;
        showToast.error(errorMessage);
      } else {
        showToast.error(toastMessages.auth.unexpectedError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        <section className="px-4 sm:px-8 md:px-16 py-8 sm:py-12 md:py-16">
          <div className="max-w-screen-2xl mx-auto">
            <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8">
              <div className="inline-flex items-center gap-2 mb-6">
                <p className="font-jost text-2xl sm:text-3xl uppercase">{authMode}</p>
              </div>

              <form onSubmit={onSubmitHandler} className="flex flex-col gap-5 sm:gap-4 text-gray-800">
                {authMode === "Sign Up" && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input
                      id="name"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      value={name}
                      type="text"
                      className="w-full px-3 py-3 sm:py-2 h-12 sm:h-11 border border-gray-300 focus:outline-none text-base"
                      autoComplete="name"
                      disabled={loading}
                      placeholder="Your name"
                      aria-label="Name"
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input
                    id="email"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    className="w-full px-3 py-3 sm:py-2 h-12 sm:h-11 border border-gray-300 focus:outline-none text-base"
                    autoComplete="email"
                    disabled={loading}
                    placeholder="Enter your email"
                    aria-label="Email"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      value={password}
                      type={showPassword ? "text" : "password"}
                      className="w-full pr-10 pl-3 py-3 sm:py-2 h-12 sm:h-11 border border-gray-300 focus:outline-none text-black text-base"
                      autoComplete={authMode === "Login" ? "current-password" : "new-password"}
                      disabled={loading}
                      placeholder="Enter your password"
                      aria-label="Password"
                      minLength={authMode === "Sign Up" ? 8 : undefined}
                      required
                    />  
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-600 hover:text-black p-2 -m-2"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        // Eye-off icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-6.94"/><path d="M1 1l22 22"/><path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88"/><path d="M14.12 5.12A10.94 10.94 0 0 1 22 12s-1 2.27-3 4"/></svg>
                      ) : (
                        // Eye icon
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  {authMode === "Sign Up" && (
                    <div className="text-xs text-gray-600 mt-1">
                      <p className="font-medium mb-1">Password must contain:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter (A-Z)</li>
                        <li>One lowercase letter (a-z)</li>
                        <li>One number (0-9)</li>
                        <li>One special character (!@#$%^&*)</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col sm:flex-row justify-between text-sm -mt-1 gap-2 sm:gap-0">
                  <button 
                    type="button" 
                    onClick={() => navigate("/forgot-password")}
                    className="text-black hover:opacity-70 transition-opacity py-2 px-1 -mx-1 text-left"
                  >
                    Forgot your password?
                  </button>
                  {authMode === "Login" ? (
                    <button type="button" onClick={() => setAuthMode("Sign Up")} className="text-black hover:opacity-70 transition-opacity py-2 px-1 -mx-1 text-left sm:text-right">
                      Create account
                    </button>
                  ) : (
                    <button type="button" onClick={() => setAuthMode("Login")} className="text-black hover:opacity-70 transition-opacity py-2 px-1 -mx-1 text-left sm:text-right">
                      Login here
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-black text-white font-light px-8 py-3 sm:py-2 mt-2 h-12 sm:h-auto text-base ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Processing..." : authMode === "Login" ? "Sign In" : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
