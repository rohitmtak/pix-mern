import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({setToken}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            
            // Basic client-side validation
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(trimmedEmail)) {
                toast.error('Please enter a valid email address');
                return;
            }

            if (trimmedPassword.length < 1) {
                toast.error('Password is required');
                return;
            }

            const response = await axios.post(backendUrl + '/api/user/admin', {
                email: trimmedEmail, 
                password: trimmedPassword
            }, {
                withCredentials: true // Include cookies in the request
            })
            
            if (response.data.success) {
                // Since we're using httpOnly cookies, we don't need to store the token
                // Just set a flag to indicate successful login
                setToken('authenticated')
                toast.success('Login successful!')
            } else {
                toast.error(response.data.message || 'Login failed')
            }
             
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Login failed. Please try again.')
            }
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24">
        <section className="px-16 py-16">
          <div className="max-w-screen-2xl mx-auto">
            <div className="w-full max-w-md mx-auto p-8">
              <div className="inline-flex items-center gap-2 mb-6">
                <p className="font-jost text-3xl uppercase">Admin Login</p>
              </div>

              <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 text-gray-800">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    className="w-full px-3 py-2 h-11 border border-gray-300 focus:outline-none"
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
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type={showPassword ? "text" : "password"}
                      className="w-full pr-10 pl-3 py-2 h-11 border border-gray-300 focus:outline-none text-black text-base md:text-base"
                      autoComplete="current-password"
                      disabled={loading}
                      placeholder="Enter your password"
                      aria-label="Password"
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

                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-black text-white font-light px-8 py-2 mt-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Processing..." : "Sign In"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Login