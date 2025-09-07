import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SavedAddressDisplay from "./SavedAddressDisplay";
import { getStateName, getCountryName } from "@/utils/addressUtils";
import { config } from "@/config/env";

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
  className?: string;
  addresses?: any[]; // Assuming addresses are of a specific shape
  onAddNewAddress?: () => void;
  showAddressForm?: boolean;
  onToggleAddressForm?: () => void;
  selectedAddressId?: string; // Add this prop
  onSaveAddress?: (addressData: any) => void; // Add this prop for saving addresses
}

const CheckoutForm = ({ 
  onSubmit, 
  className, 
  addresses = [], 
  onAddNewAddress,
  showAddressForm = false,
  onToggleAddressForm,
  selectedAddressId,
  onSaveAddress
}: CheckoutFormProps) => {
  
  // Debug logging removed for cleaner console
  // Strong validation schema
  const shippingSchema = z.object({
    firstName: z.string().min(2, { message: "Enter a first name" }),
    lastName: z.string().min(2, { message: "Enter a last name" }),
    address: z.string().min(5, { message: "Enter an address" }),
    apartment: z.string().optional(),
    city: z.string().min(2, { message: "Enter a city" }),
    state: z.string().min(2, { message: "Select a state" }),
    postalCode: z
      .string()
      .regex(/^\d{6}$/, { message: "Enter a 6-digit PIN code" }),
    country: z.string().min(2, { message: "Select a country" }),
    phone: z
      .string()
      .min(1, { message: "Phone number is required" })
      .regex(/^(\+91\d{10}|\d{10})$/, { message: "Please enter a valid phone number" }),
    sameAsShipping: z.boolean().optional().default(true),
  }).refine((data) => {
    // If billing address is different from shipping, validate billing fields
    if (!data.sameAsShipping) {
      // Billing address validation will be handled in the form submission
      return true;
    }
    return true;
  });

  type ShippingForm = z.infer<typeof shippingSchema>;

  const {
    register,
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      phone: "",
      sameAsShipping: true, // Default to true as per best practices
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [paymentData, setPaymentData] = useState({
    method: "upi" as "card" | "netbanking" | "upi",
    sameAsShipping: true, // Checked by default as per best practices
    billingAddress: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India"
    }
  });

  // Function to handle saving the new address
  const handleSaveAddress = () => {
    // Trigger form validation
    const isValid = trigger();
    if (isValid) {
      const values = getValues();
      if (onSaveAddress) {
        const addressData = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fullName: `${values.firstName} ${values.lastName}`.trim(),
          phone: values.phone,
          line1: values.address,
          line2: values.apartment || '',
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: values.country,
          isDefault: addresses.length === 0, // Set as default if no addresses exist
        };
        onSaveAddress(addressData);
      }
    }
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const onSubmitForm = (values: ShippingForm) => {
    // Validate billing address if different from shipping
    if (!paymentData.sameAsShipping) {
      const billingAddress = paymentData.billingAddress;
      if (!billingAddress.address || !billingAddress.city || !billingAddress.state || !billingAddress.postalCode || !billingAddress.country) {
        // Show error message
        alert('Please fill in all required billing address fields.');
        return;
      }
    }
    
    // If we have a selected address and the form is not showing, use the selected address data
    if (selectedAddressId && addresses.length > 0 && !showAddressForm) {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress) {
        const formData = {
          firstName: selectedAddress.fullName.split(' ')[0] || '',
          lastName: selectedAddress.fullName.split(' ').slice(1).join(' ') || '',
          phone: selectedAddress.phone,
          address: selectedAddress.line1,
          apartment: selectedAddress.line2 || '',
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          payment: paymentData
        };
        onSubmit(formData);
        return;
      }
    }
    
    onSubmit({ ...values, payment: paymentData });
  };



  return (
    <form id="checkout-form" onSubmit={handleSubmit(onSubmitForm)} className={cn("space-y-6 sm:space-y-8", className)}>
      <div>
        <h2 
          className="text-black font-normal uppercase mb-4 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 24px)',
            fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
            fontWeight: 400,
            color: 'rgba(0,0,0,1)'
          }}
        >
          Shipping Address
        </h2>
        
        {/* Always show saved addresses if they exist */}
        {addresses.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <SavedAddressDisplay
              addresses={addresses}
              onAddNewAddress={onAddNewAddress || (() => {})}
              selectedAddressId={selectedAddressId}
              showAddButton={!showAddressForm}
            />
          </div>
        )}

        {/* Show new address form if showAddressForm is true */}
        {showAddressForm && (
          <div className="mt-3 sm:mt-4 px-3 sm:px-4 py-4 sm:py-6 border border-gray-200 bg-[#f2f2f2]">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 
                className="text-black font-normal"
                style={{
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 400,
                  color: 'rgba(0,0,0,1)'
                }}
              >
                Add New Address
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={onToggleAddressForm}
                className="text-xs sm:text-sm border-gray-300 hover:bg-gray-50 px-2 sm:px-3 py-1 sm:py-2"
              >
                Cancel
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="firstName" className="text-xs sm:text-sm">First Name</Label>
                <Input id="firstName" className={cn("mt-1 h-9 sm:h-10 text-sm sm:text-base", errors.firstName && "border-red-500")} {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-xs sm:text-sm">Last Name</Label>
                <Input id="lastName" className={cn("mt-1 h-9 sm:h-10 text-sm sm:text-base", errors.lastName && "border-red-500")} {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-xs sm:text-sm">Address</Label>
                <Input id="address" className={cn("mt-1 h-9 sm:h-10 text-sm sm:text-base", errors.address && "border-red-500")} {...register("address")} />
                {errors.address && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.address.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="apartment" className="text-xs sm:text-sm">Apartment, suite, etc. (optional)</Label>
                <Input id="apartment" className="mt-1 h-9 sm:h-10 text-sm sm:text-base" {...register("apartment")} />
              </div>
              <div>
                <Label htmlFor="city" className="text-xs sm:text-sm">City</Label>
                <Input id="city" className={cn("mt-1 h-9 sm:h-10 text-sm sm:text-base", errors.city && "border-red-500")} {...register("city")} />
                {errors.city && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state" className="text-xs sm:text-sm">State</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(value) => field.onChange(value)} 
                      value={field.value || ""}
                    >
                      <SelectTrigger className={cn("mt-1 h-9 sm:h-10 text-sm sm:text-base focus:ring-0 focus:ring-offset-0 focus:border-gray-300", errors.state && "border-red-500")}> 
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                        <SelectItem value="Assam">Assam</SelectItem>
                        <SelectItem value="Bihar">Bihar</SelectItem>
                        <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                        <SelectItem value="Goa">Goa</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Haryana">Haryana</SelectItem>
                        <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                        <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Kerala">Kerala</SelectItem>
                        <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Manipur">Manipur</SelectItem>
                        <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                        <SelectItem value="Mizoram">Mizoram</SelectItem>
                        <SelectItem value="Nagaland">Nagaland</SelectItem>
                        <SelectItem value="Odisha">Odisha</SelectItem>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="Sikkim">Sikkim</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Telangana">Telangana</SelectItem>
                        <SelectItem value="Tripura">Tripura</SelectItem>
                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                        <SelectItem value="West Bengal">West Bengal</SelectItem>
                        <SelectItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</SelectItem>
                        <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                        <SelectItem value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                        <SelectItem value="Ladakh">Ladakh</SelectItem>
                        <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                        <SelectItem value="Puducherry">Puducherry</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.state.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="postalCode" className="text-xs sm:text-sm">PIN code</Label>
                <Input 
                  id="postalCode" 
                  className={cn("mt-1 h-9 sm:h-10 text-sm sm:text-base", errors.postalCode && "border-red-500")} 
                  placeholder="Enter 6-digit PIN code"
                  {...register("postalCode", {
                    onChange: (e) => {
                      // Only allow digits, max 6 characters
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 6) {
                        e.target.value = value;
                      } else {
                        e.target.value = value.slice(0, 6);
                      }
                    }
                  })} 
                />
                {errors.postalCode && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.postalCode.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country" className="text-xs sm:text-sm">Country</Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(value) => field.onChange(value)} 
                      value={field.value || ""}
                    >
                      <SelectTrigger className={cn("mt-1 h-9 sm:h-10 text-sm sm:text-base focus:ring-0 focus:ring-offset-0 focus:border-gray-300", errors.country && "border-red-500")}> 
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.country.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneNumberInput
                      id="phone"
                      label="Phone Number"
                      value={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                        // Only trigger validation if there's actually a phone number entered
                        // (not just a country code)
                        if (value && value.length > 4) { // Country codes are typically 2-4 characters
                          trigger("phone");
                        }
                      }}
                      placeholder="Enter phone number"
                      error={!!errors.phone}
                      required
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
            
            {/* Save Address Button */}
            <div className="flex justify-end pt-4 sm:pt-6">
              <Button
                type="button"
                onClick={handleSaveAddress}
                className="bg-black text-white hover:bg-gray-800 px-4 sm:px-6 py-2 text-sm sm:text-base"
              >
                Save Address
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Shipping Method placeholder (shows guidance like the reference) */}
      {/* <div>
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
      </div> */}

      {/* Payment - collapsible options */}
      <div>
        <h2 
          className="text-black font-normal uppercase mb-2"
          style={{
            fontSize: 'clamp(18px, 4vw, 24px)',
            fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
            fontWeight: 400,
            color: 'rgba(0,0,0,1)'
          }}
        >
          Payment
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">All transactions are secure and encrypted.</p>
        
        {/* Payment Methods */}
        <div className="space-y-2 sm:space-y-3">
          {/* UPI */}
          <div className="border rounded-md overflow-hidden">
            <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment-method"
                checked={paymentData.method === "upi"}
                onChange={() => handlePaymentChange("method", "upi")}
                className="h-4 w-4 text-blue-600"
              />
              <div className="flex items-center gap-2 sm:gap-3">
                <img alt="upi" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/upi.CmgCfll8.svg" width="38" height="24" />
              </div>
              <span className="text-sm sm:text-base">UPI</span>
            </label>
            {paymentData.method === "upi" && (
              <div className="p-3 sm:p-4 border-t bg-[#f2f2f2]">
                <p className="text-xs sm:text-sm text-gray-700">
                  After clicking 'Complete Purchase', a pop-up will appear 
                  asking you to enter your UPI ID or scan the shown QR code to complete the purchase. 
                  You will be redirected to the Order Confirmation page afterwards.
                </p>
              </div>
            )}
          </div>

          {/* Card */}
          <div className="border rounded-md overflow-hidden">
            <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment-method"
                checked={paymentData.method === "card"}
                onChange={() => handlePaymentChange("method", "card")}
                className="h-4 w-4 text-blue-600"
              />
              <div className="flex items-center gap-2 sm:gap-3">
                <img alt="visa" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/visa.sxIq5Dot.svg" width="38" height="24" />
                <img alt="master" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/master.CzeoQWmc.svg" width="38" height="24" />
              </div>
              <span className="text-sm sm:text-base">Card</span>
            </label>
            {paymentData.method === "card" && (
              <div className="p-3 sm:p-4 border-t bg-[#f2f2f2]">
                <p className="text-xs sm:text-sm text-gray-700">
                  After clicking 'Complete Purchase', a pop-up will appear asking you to select your saved card or
                  complete purchase with a new credit/debit card. You will be redirected to the Order Confirmation page afterwards.
                </p>
              </div>
            )}
          </div>

          {/* NetBanking */}
          <div className="border rounded-md overflow-hidden">
            <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment-method"
                checked={paymentData.method === "netbanking"}
                onChange={() => handlePaymentChange("method", "netbanking")}
                className="h-4 w-4 text-blue-600"
              />
              <div className="flex items-center gap-2 sm:gap-3">
                <img alt="netbanking" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/netbanking.C9e9yzjv.svg" width="38" height="24" />
              </div>
              <span className="text-sm sm:text-base">NetBanking</span>
            </label>
            {paymentData.method === "netbanking" && (
              <div className="p-3 sm:p-4 border-t bg-[#f2f2f2]">
                <p className="text-xs sm:text-sm text-gray-700">
                  After clicking 'Complete Purchase', a pop-up will appear 
                  asking you to select your desired bank to complete the purchase. 
                  You will be redirected to the Order Confirmation page afterwards.
                </p>
              </div>
            )}
          </div>
        </div>

        
      </div>

      {/* Billing address - Conditionally rendered based on feature flag */}
      {config.features.billingAddress.enabled && (
        <div>
          <h3 
            className="text-black font-normal mb-2 sm:mb-3"
            style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
              fontWeight: 400,
              color: 'rgba(0,0,0,1)'
            }}
          >
            Billing address
          </h3>
          
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            For UPI, Card and Net Banking payments, your shipping address will automatically be used for billing. 
            For card payments, a separate billing address may be required by your bank for verification.
          </p>
          
          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <Checkbox
              id="sameAsShipping"
              checked={paymentData.sameAsShipping}
              onCheckedChange={(checked) => {
                setPaymentData(prev => ({
                  ...prev,
                  sameAsShipping: checked as boolean,
                  billingAddress: checked ? { address: "", city: "", state: "", postalCode: "", country: "IN" } : prev.billingAddress
                }));
              }}
            />
            <Label 
              htmlFor="sameAsShipping" 
              className="text-xs sm:text-sm font-normal cursor-pointer"
            >
              Billing address is same as shipping address
            </Label>
          </div>

          {!paymentData.sameAsShipping && (
            <div className="mt-3 sm:mt-4 px-3 sm:px-4 py-4 sm:py-6 border border-gray-200 bg-[#f2f2f2]">
              <h4 
                className="text-black font-normal mb-3"
                style={{
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                  fontWeight: 400,
                  color: 'rgba(0,0,0,1)'
                }}
              >
                Enter Billing Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="billingAddress" className="text-xs sm:text-sm">Address *</Label>
                  <Input
                    id="billingAddress"
                    value={paymentData.billingAddress.address}
                    onChange={(e) => setPaymentData(prev => ({
                      ...prev,
                      billingAddress: { ...prev.billingAddress, address: e.target.value }
                    }))}
                    className="mt-1 h-9 sm:h-10 text-sm sm:text-base"
                    required={!paymentData.sameAsShipping}
                  />
                </div>
                <div>
                  <Label htmlFor="billingCity" className="text-xs sm:text-sm">City *</Label>
                  <Input
                    id="billingCity"
                    value={paymentData.billingAddress.city}
                    onChange={(e) => setPaymentData(prev => ({
                      ...prev,
                      billingAddress: { ...prev.billingAddress, city: e.target.value }
                    }))}
                    className="mt-1 h-9 sm:h-10 text-sm sm:text-base"
                    required={!paymentData.sameAsShipping}
                  />
                </div>
                <div>
                  <Label htmlFor="billingState" className="text-xs sm:text-sm">State *</Label>
                  <Select 
                    onValueChange={(value) => setPaymentData(prev => ({
                      ...prev,
                      billingAddress: { ...prev.billingAddress, state: value }
                    }))} 
                    value={paymentData.billingAddress.state || ""}
                  >
                    <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm sm:text-base"> 
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                      <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                      <SelectItem value="Assam">Assam</SelectItem>
                      <SelectItem value="Bihar">Bihar</SelectItem>
                      <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                      <SelectItem value="Goa">Goa</SelectItem>
                      <SelectItem value="Gujarat">Gujarat</SelectItem>
                      <SelectItem value="Haryana">Haryana</SelectItem>
                      <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                      <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Kerala">Kerala</SelectItem>
                      <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Manipur">Manipur</SelectItem>
                      <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                      <SelectItem value="Mizoram">Mizoram</SelectItem>
                      <SelectItem value="Nagaland">Nagaland</SelectItem>
                      <SelectItem value="Odisha">Odisha</SelectItem>
                      <SelectItem value="Punjab">Punjab</SelectItem>
                      <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="Sikkim">Sikkim</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Telangana">Telangana</SelectItem>
                      <SelectItem value="Tripura">Tripura</SelectItem>
                      <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                      <SelectItem value="West Bengal">West Bengal</SelectItem>
                      <SelectItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</SelectItem>
                      <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                      <SelectItem value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                      <SelectItem value="Ladakh">Ladakh</SelectItem>
                      <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                      <SelectItem value="Puducherry">Puducherry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="billingPostal" className="text-xs sm:text-sm">PIN code *</Label>
                  <Input
                    id="billingPostal"
                    value={paymentData.billingAddress.postalCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 6) {
                        setPaymentData(prev => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, postalCode: value }
                        }));
                      }
                    }}
                    className="mt-1 h-9 sm:h-10 text-sm sm:text-base"
                    placeholder="Enter 6-digit PIN code"
                    required={!paymentData.sameAsShipping}
                  />
                </div>
                <div>
                  <Label htmlFor="billingCountry" className="text-xs sm:text-sm">Country *</Label>
                  <Select 
                    onValueChange={(value) => setPaymentData(prev => ({
                      ...prev,
                      billingAddress: { ...prev.billingAddress, country: value }
                    }))} 
                    value={paymentData.billingAddress.country || ""}
                  >
                    <SelectTrigger className="mt-1 h-9 sm:h-10 text-sm sm:text-base"> 
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit button rendered in CheckoutPage on the right via form="checkout-form" */}
    </form>
  );
};

export default CheckoutForm;
