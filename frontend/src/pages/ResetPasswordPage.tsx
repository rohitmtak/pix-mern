import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { showToast, toastMessages } from "@/config/toastConfig";
import { config } from "@/config/env";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecking, setTokenChecking] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        setTokenChecking(false);
        return;
      }

      try {
        const response = await axios.get(`${config.api.baseUrl}/user/verify-reset-token/${token}`);
        setTokenValid(response.data?.success || false);
      } catch (error) {
        setTokenValid(false);
      } finally {
        setTokenChecking(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      showToast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      showToast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${config.api.baseUrl}/user/reset-password`, {
        token,
        newPassword: password
      });

      if (response.data?.success) {
        showToast.success(response.data.message);
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login");
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

        if (tokenChecking) {
     return (
       <div className="min-h-screen bg-white">
         <Header />
         <main className="pt-24">
           <section className="px-16 py-16">
             <div className="max-w-screen-2xl mx-auto">
               <div className="w-full max-w-md mx-auto p-8 text-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                 <p className="text-gray-600">Verifying reset link...</p>
               </div>
             </div>
           </section>
         </main>
         <Footer />
       </div>
     );
   }

   if (!tokenValid) {
     return (
       <div className="min-h-screen bg-white">
         <Header />
         <main className="pt-24">
           <section className="px-16 py-16">
             <div className="max-w-screen-2xl mx-auto">
               <div className="w-full max-w-md mx-auto p-8 text-center">
                 <div className="inline-flex items-center gap-2 mb-6">
                   <p className="font-jost text-3xl uppercase">Invalid Reset Link</p>
                 </div>
                 <p className="text-gray-600 mb-6">
                   This password reset link is invalid or has expired. Please request a new one.
                 </p>
                 <button
                   onClick={() => navigate("/forgot-password")}
                   className="bg-black text-white font-light px-8 py-2"
                 >
                   Request New Reset Link
                 </button>
               </div>
             </div>
           </section>
         </main>
         <Footer />
       </div>
     );
   }

   return (
     <div className="min-h-screen bg-white">
       <Header />
       <main className="pt-24">
         <section className="px-16 py-16">
           <div className="max-w-screen-2xl mx-auto">
             <div className="w-full max-w-md mx-auto p-8">
               <div className="inline-flex items-center gap-2 mb-6">
                 <p className="font-jost text-3xl uppercase">Reset Password</p>
               </div>

               <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 text-gray-800">
                 <div className="flex flex-col gap-2">
                   <label htmlFor="password" className="text-sm font-medium">New Password</label>
                   <div className="relative">
                     <input
                       id="password"
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                       value={password}
                       type={showPassword ? "text" : "password"}
                       className="w-full pr-10 pl-3 py-2 h-11 border border-gray-300 focus:outline-none"
                       autoComplete="new-password"
                       disabled={loading}
                       placeholder="Enter new password"
                       aria-label="New Password"
                       minLength={8}
                       required
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black p-0 leading-none"
                       aria-label={showPassword ? "Hide password" : "Show password"}
                     >
                       {showPassword ? (
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-6.94"/><path d="M1 1l22 22"/><path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88"/><path d="M14.12 5.12A10.94 10.94 0 0 1 22 12s-1 2.27-3 4"/></svg>
                       ) : (
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                       )}
                     </button>
                   </div>
                 </div>

                 <div className="flex flex-col gap-2">
                   <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                   <div className="relative">
                     <input
                       id="confirmPassword"
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                       value={confirmPassword}
                       type={showConfirmPassword ? "text" : "password"}
                       className="w-full pr-10 pl-3 py-2 h-11 border border-gray-300 focus:outline-none"
                       autoComplete="new-password"
                       disabled={loading}
                       placeholder="Confirm new password"
                       aria-label="Confirm Password"
                       minLength={8}
                       required
                     />
                     <button
                       type="button"
                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black p-0 leading-none"
                       aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                     >
                       {showConfirmPassword ? (
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-6.94"/><path d="M1 1l22 22"/><path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88"/><path d="M14.12 5.12A10.94 10.94 0 0 1 22 12s-1 2.27-3 4"/></svg>
                       ) : (
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
                   {loading ? "Resetting..." : "Reset Password"}
                 </button>

                 <div className="text-center mt-4">
                   <button
                     type="button"
                     onClick={() => navigate("/login")}
                     className="text-black hover:opacity-70 transition-opacity text-sm"
                   >
                     Back to Login
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </section>
       </main>
       <Footer />
     </div>
   );
};

export default ResetPasswordPage;
