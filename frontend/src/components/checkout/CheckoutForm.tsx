import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
  className?: string;
}

const CheckoutForm = ({ onSubmit, className }: CheckoutFormProps) => {
  // Strong validation schema
  const shippingSchema = z.object({
    email: z.string().email({ message: "Enter a valid email" }),
    firstName: z.string().min(2, { message: "Enter a first name" }),
    lastName: z.string().min(2, { message: "Enter a last name" }),
    address: z.string().min(5, { message: "Enter an address" }),
    apartment: z.string().optional(),
    city: z.string().min(2, { message: "Enter a city" }),
    state: z.string().min(1, { message: "Select a state" }),
    postalCode: z
      .string()
      .regex(/^\d{6}$/, { message: "Enter a 6-digit PIN code" }),
    country: z.string().min(1, { message: "Select a country" }),
    phone: z
      .string()
      .regex(/^(\+91\d{10}|\d{10})$/, { message: "Please enter a valid phone number. It should be 10 digits long or include the +91 country code." }),
    saveInfo: z.boolean().optional().default(false),
    sameAsShipping: z.boolean().optional().default(true),
  });

  type ShippingForm = z.infer<typeof shippingSchema>;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "IN",
      phone: "",
      saveInfo: false,
      sameAsShipping: true,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [paymentData, setPaymentData] = useState({
    method: "card" as "card" | "netbanking" | "upi",
    billingAddress: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    }
  });

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmitForm = (values: ShippingForm) => {
    onSubmit({ ...values, payment: paymentData });
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit(onSubmitForm)} className={cn("space-y-8", className)}>
      {/* Contact Information */}
      <div>
        <h2 
          className="text-black font-normal uppercase mb-6"
          style={{
            fontSize: '24px',
            fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
            fontWeight: 400,
            color: 'rgba(0,0,0,1)'
          }}
        >
          Contact Information
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className={cn("mt-1", errors.email && "border-red-500")}
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="saveInfo"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox id="save-info" checked={Boolean(value)} onCheckedChange={(c) => onChange(Boolean(c))} />
              )}
            />
            <Label htmlFor="save-info" className="text-sm">
              Save this information for next time
            </Label>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h2 
          className="text-black font-normal uppercase mb-6"
          style={{
            fontSize: '24px',
            fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
            fontWeight: 400,
            color: 'rgba(0,0,0,1)'
          }}
        >
          Shipping Address
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" className={cn("mt-1", errors.firstName && "border-red-500")} {...register("firstName")} />
            {errors.firstName && (
              <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" className={cn("mt-1", errors.lastName && "border-red-500")} {...register("lastName")} />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" className={cn("mt-1", errors.address && "border-red-500")} {...register("address")} />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
            <Input id="apartment" className="mt-1" {...register("apartment")} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" className={cn("mt-1", errors.city && "border-red-500")} {...register("city")} />
            {errors.city && (
              <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("mt-1", errors.state && "border-red-500")}> 
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DL">Delhi</SelectItem>
                    <SelectItem value="MH">Maharashtra</SelectItem>
                    <SelectItem value="KA">Karnataka</SelectItem>
                    <SelectItem value="TN">Tamil Nadu</SelectItem>
                    <SelectItem value="WB">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.state && (
              <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="postalCode">PIN code</Label>
            <Input id="postalCode" className={cn("mt-1", errors.postalCode && "border-red-500")} {...register("postalCode")} />
            {errors.postalCode && (
              <p className="text-sm text-red-600 mt-1">{errors.postalCode.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("mt-1", errors.country && "border-red-500")}> 
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              className={cn("mt-1", errors.phone && "border-red-500")} 
              placeholder=""
              {...register("phone")} 
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Method placeholder (shows guidance like the reference) */}
      <div>
        <h2 
          className="text-black font-normal uppercase mb-3"
          style={{
            fontSize: '18px',
            fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
            fontWeight: 500,
            color: 'rgba(0,0,0,1)'
          }}
        >
          Shipping method
        </h2>
        <div className="border rounded-md p-3 text-sm text-gray-600 bg-gray-50">
          Enter your shipping address to view available shipping methods.
        </div>
      </div>

      {/* Payment - collapsible options */}
      <div>
        <h2 
          className="text-black font-normal uppercase mb-2"
          style={{
            fontSize: '24px',
            fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
            fontWeight: 400,
            color: 'rgba(0,0,0,1)'
          }}
        >
          Payment
        </h2>
        <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>
        {/* Card */}
        <div className={cn(
          "rounded-md overflow-hidden border",
          paymentData.method === "card" ? "border-black" : "border-gray-200"
        )}>
          <button
            type="button"
            aria-expanded={paymentData.method === "card"}
            onClick={() => handlePaymentChange("method", "card")}
            className={cn(
              "w-full flex items-center gap-4 p-4 text-left",
              paymentData.method === "card" ? "bg-gray-50" : "bg-white"
            )}
          >
            <span className={cn(
              "inline-flex items-center justify-center w-4 h-4 rounded-full border",
              paymentData.method === "card" ? "bg-blue-600 border-blue-600" : "border-gray-400"
            )} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img alt="visa" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/visa.sxIq5Dot.svg" width="38" height="24" />
                  <img alt="master" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/master.CzeoQWmc.svg" width="38" height="24" />
                </div>
                <div className="text-xs tracking-wide uppercase text-gray-800">Card</div>
              </div>
            </div>
          </button>

          {paymentData.method === "card" && (
            <div className="p-6 border-t bg-white">
              <p className="text-sm text-gray-700">
                After clicking ‘Complete Purchase’, a pop-up will appear asking you to select your saved card or
                complete purchase with a new credit/debit card. You will be redirected to the Order Confirmation page afterwards.
              </p>
            </div>
          )}
        </div>

        {/* NetBanking */}
        <div className={cn(
          "rounded-md mt-3 overflow-hidden border",
          paymentData.method === "netbanking" ? "border-black" : "border-gray-200"
        )}>
          <button
            type="button"
            aria-expanded={paymentData.method === "netbanking"}
            onClick={() => handlePaymentChange("method", "netbanking")}
            className={cn(
              "w-full flex items-center gap-4 p-4 text-left",
              paymentData.method === "netbanking" ? "bg-gray-50" : "bg-white"
            )}
          >
            <span className={cn(
              "inline-flex items-center justify-center w-4 h-4 rounded-full border",
              paymentData.method === "netbanking" ? "bg-blue-600 border-blue-600" : "border-gray-400"
            )} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img alt="netbanking" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/netbanking.C9e9yzjv.svg" width="38" height="24" />
                </div>
                <div className="text-xs tracking-wide uppercase text-gray-800">NetBanking</div>
              </div>
            </div>
          </button>
          {paymentData.method === "netbanking" && (
            <div className="p-6 border-t bg-white">
              <p className="text-sm text-gray-700">After clicking ‘Complete Purchase’, a pop-up will appear 
                asking you to select your desired bank to complete the purchase. 
                You will be redirected to the Order Confirmation page afterwards.</p>
            </div>
          )}
        </div>

        {/* UPI */}
        <div className={cn(
          "rounded-md mt-3 overflow-hidden border",
          paymentData.method === "upi" ? "border-black" : "border-gray-200"
        )}>
          <button
            type="button"
            aria-expanded={paymentData.method === "upi"}
            onClick={() => handlePaymentChange("method", "upi")}
            className={cn(
              "w-full flex items-center gap-4 p-4 text-left",
              paymentData.method === "upi" ? "bg-gray-50" : "bg-white"
            )}
          >
            <span className={cn(
              "inline-flex items-center justify-center w-4 h-4 rounded-full border",
              paymentData.method === "upi" ? "bg-blue-600 border-blue-600" : "border-gray-400"
            )} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img alt="upi" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/upi.CmgCfll8.svg" width="38" height="24" />
                </div>
                <div className="text-xs tracking-wide uppercase text-gray-800">UPI</div>
              </div>
            </div>
          </button>
          {paymentData.method === "upi" && (
            <div className="p-6 border-t bg-white">
              <p className="text-sm text-gray-700">After clicking ‘Complete Purchase’, a pop-up will appear 
                asking you to enter your UPI ID or scan the shown QR code to complete the purchase. 
                You will be redirected to the Order Confirmation page afterwards.</p>
            </div>
          )}
        </div>

        
      </div>

      {/* Billing address */}
      <div>
        <h3 className="text-black font-medium mb-3">Billing address</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer">
            <input
              type="radio"
              name="billing-address"
              checked={paymentData.billingAddress.address === ""}
              onChange={() => setPaymentData(prev => ({
                ...prev,
                billingAddress: { address: "", city: "", state: "", postalCode: "", country: "" }
              }))}
              className="h-4 w-4"
            />
            <span>Same as shipping address</span>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer">
            <input
              type="radio"
              name="billing-address"
              checked={paymentData.billingAddress.address !== ""}
              onChange={() => setPaymentData(prev => ({
                ...prev,
                billingAddress: { address: " ", city: "", state: "", postalCode: "", country: "" }
              }))}
              className="h-4 w-4"
            />
            <span>Use a different billing address</span>
          </label>
        </div>

        {paymentData.billingAddress.address !== "" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="billingAddress">Address</Label>
              <Input
                id="billingAddress"
                value={paymentData.billingAddress.address}
                onChange={(e) => setPaymentData(prev => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, address: e.target.value }
                }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="billingCity">City</Label>
              <Input
                id="billingCity"
                value={paymentData.billingAddress.city}
                onChange={(e) => setPaymentData(prev => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, city: e.target.value }
                }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="billingState">State</Label>
              <Input
                id="billingState"
                value={paymentData.billingAddress.state}
                onChange={(e) => setPaymentData(prev => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, state: e.target.value }
                }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="billingPostal">Postal Code</Label>
              <Input
                id="billingPostal"
                value={paymentData.billingAddress.postalCode}
                onChange={(e) => setPaymentData(prev => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, postalCode: e.target.value }
                }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="billingCountry">Country</Label>
              <Input
                id="billingCountry"
                value={paymentData.billingAddress.country}
                onChange={(e) => setPaymentData(prev => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, country: e.target.value }
                }))}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit button rendered in CheckoutPage on the right via form="checkout-form" */}
    </form>
  );
};

export default CheckoutForm;
