import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-36">
        <div className="container mx-auto px-16 py-24">
          <div className="max-w-2xl mx-auto text-center">
            
            {/* Success Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-600"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 
              className="text-black font-normal uppercase mb-6"
              style={{
                fontSize: '50px',
                fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                fontWeight: 400,
                lineHeight: '60px',
                color: 'rgba(0,0,0,1)'
              }}
            >
              Order Confirmed!
            </h1>

            <p 
              className="text-gray-600 mb-8 max-w-md mx-auto"
              style={{
                fontSize: '18px',
                fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                lineHeight: '28px'
              }}
            >
              Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 p-8 rounded-lg mb-8 text-left">
              <h2 
                className="text-black font-medium mb-4"
                style={{
                  fontSize: '24px',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 500
                }}
              >
                Order Details
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>Order Number: #HS2024001</p>
                <p>Estimated Delivery: 7-10 business days</p>
                <p>Tracking information will be sent to your email</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/collection')}
                className="bg-black text-white hover:bg-gray-800 px-8 py-3"
              >
                CONTINUE SHOPPING
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-black text-black hover:bg-gray-50 px-8 py-3"
              >
                BACK TO HOME
              </Button>
            </div>

            {/* Customer Service */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <p 
                className="text-gray-600 mb-4"
                style={{
                  fontSize: '16px',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif'
                }}
              >
                Need help with your order?
              </p>
              <p className="text-black">
                Contact our customer service team at{' '}
                <a href="mailto:support@highstreetpix.com" className="underline">
                  support@highstreetpix.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
