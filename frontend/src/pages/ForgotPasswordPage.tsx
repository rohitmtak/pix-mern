import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { showToast, toastMessages } from "@/config/toastConfig";
import { config } from "@/config/env";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${config.api.baseUrl}/user/forgot-password`, {
        email
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        <section className="px-4 sm:px-8 md:px-16 py-8 sm:py-12 md:py-16">
          <div className="max-w-screen-2xl mx-auto">
            <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8">
              <div className="inline-flex items-center gap-2 mb-6">
                <p className="font-jost text-2xl sm:text-3xl uppercase">Forgot Password</p>
              </div>

              <form onSubmit={onSubmitHandler} className="flex flex-col gap-5 sm:gap-4 text-gray-800">
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

                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-black text-white font-light px-8 py-3 sm:py-2 mt-2 h-12 sm:h-auto text-base ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-black hover:opacity-70 transition-opacity text-sm py-2 px-1 -mx-1"
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

export default ForgotPasswordPage;
