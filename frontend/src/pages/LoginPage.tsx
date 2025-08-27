import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { toast } from "sonner";
import { config } from "@/config/env";

const Login: React.FC = () => {
  const navigate = useNavigate();

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
        toast.error("Please enter a valid email address.");
        return;
      }

      if (authMode === "Sign Up" && trimmedPassword.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }

      if (authMode === "Sign Up" && name.trim().length < 2) {
        toast.error("Please enter your name.");
        return;
      }

      const endpoint = `${config.api.baseUrl}/user/${authMode === "Sign Up" ? "register" : "login"}`;
      const payload = authMode === "Sign Up" ? { name: name.trim(), email: trimmedEmail, password: trimmedPassword } : { email: trimmedEmail, password: trimmedPassword };
      const response = await axios.post(endpoint, payload);

      if (response.data?.success && response.data?.token) {
        localStorage.setItem("token", response.data.token);
        toast.success(authMode === "Login" ? "Login successful!" : "Account created!");
        navigate("/");
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Request failed");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        <section className="px-16 py-16">
          <div className="max-w-screen-2xl mx-auto">
            <div className="w-full max-w-md mx-auto border border-gray-200 shadow-sm p-8">
              <div className="inline-flex items-center gap-2 mb-6">
                <p className="font-jost text-3xl uppercase">{authMode}</p>
                <hr className="border-none h-[1.5px] w-8 bg-black" />
              </div>

              <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 text-gray-800">
                {authMode === "Sign Up" && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input
                      id="name"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      value={name}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
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
                    className="w-full px-3 py-2 h-11 border border-gray-300 focus:outline-none"
                    autoComplete="email"
                    disabled={loading}
                    placeholder="you@example.com"
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
                      className="w-full pr-10 pl-3 py-2 h-11 border border-gray-300 focus:outline-none text-black text-base md:text-base placeholder-gray-600"
                      autoComplete={authMode === "Login" ? "current-password" : "new-password"}
                      disabled={loading}
                      placeholder="••••••••"
                      aria-label="Password"
                      minLength={authMode === "Sign Up" ? 8 : undefined}
                      required
                    />  
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black p-0 leading-none"
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
                </div>

                <div className="w-full flex justify-between text-sm -mt-1">
                  <button type="button" className="text-black hover:opacity-70 transition-opacity">
                    Forgot your password?
                  </button>
                  {authMode === "Login" ? (
                    <button type="button" onClick={() => setAuthMode("Sign Up")} className="text-black hover:opacity-70 transition-opacity">
                      Create account
                    </button>
                  ) : (
                    <button type="button" onClick={() => setAuthMode("Login")} className="text-black hover:opacity-70 transition-opacity">
                      Login here
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-black text-white font-light px-8 py-2 mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
