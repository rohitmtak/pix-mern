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
import SavedAddressDisplay from "./SavedAddressDisplay";
import { getStateName, getCountryName } from "@/utils/addressUtils";

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
      .regex(/^(\+91\d{10}|\d{10})$/, { message: "Please enter a valid phone number. It should be 10 digits long or include the +91 country code." }),
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
    <form id="checkout-form" onSubmit={handleSubmit(onSubmitForm)} className={cn("space-y-8", className)}>
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
        
        {/* Always show saved addresses if they exist */}
        {addresses.length > 0 && (
          <div className="mb-8">
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
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-black font-normal"
                style={{
                  fontSize: '16px',
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
                className="text-sm border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
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
                    <Select 
                      onValueChange={(value) => field.onChange(value)} 
                      value={field.value || ""}
                    >
                      <SelectTrigger className={cn("mt-1", errors.state && "border-red-500")}> 
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="West Bengal">West Bengal</SelectItem>
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
                <Input 
                  id="postalCode" 
                  className={cn("mt-1", errors.postalCode && "border-red-500")} 
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
                  <p className="text-sm text-red-600 mt-1">{errors.postalCode.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(value) => field.onChange(value)} 
                      value={field.value || ""}
                    >
                      <SelectTrigger className={cn("mt-1", errors.country && "border-red-500")}> 
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
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
                  placeholder="Enter phone number (10 digits or +91XXXXXXXXXX)"
                  {...register("phone", {
                    onChange: (e) => {
                      // Only allow digits and +, max 13 characters
                      const value = e.target.value.replace(/[^0-9+]/g, '');
                      if (value.length <= 13) {
                        e.target.value = value;
                      } else {
                        e.target.value = value.slice(0, 13);
                      }
                    }
                  })} 
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
            
            {/* Save Address Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={handleSaveAddress}
                className="bg-black text-white hover:bg-gray-800 px-6 py-2"
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
            fontSize: '24px',
            fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
            fontWeight: 400,
            color: 'rgba(0,0,0,1)'
          }}
        >
          Payment
        </h2>
        <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>
        
        {/* Payment Methods */}
        <div className="space-y-3">
          {/* UPI */}
          <div className="border rounded-md overflow-hidden">
            <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment-method"
                checked={paymentData.method === "upi"}
                onChange={() => handlePaymentChange("method", "upi")}
                className="h-4 w-4 text-blue-600"
              />
              <div className="flex items-center gap-3">
                <img alt="upi" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/upi.CmgCfll8.svg" width="38" height="24" />
              </div>
              <span>UPI</span>
            </label>
            {paymentData.method === "upi" && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-700">
                  After clicking 'Complete Purchase', a pop-up will appear 
                  asking you to enter your UPI ID or scan the shown QR code to complete the purchase. 
                  You will be redirected to the Order Confirmation page afterwards.
                </p>
              </div>
            )}
          </div>

          {/* Card */}
          <div className="border rounded-md overflow-hidden">
            <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment-method"
                checked={paymentData.method === "card"}
                onChange={() => handlePaymentChange("method", "card")}
                className="h-4 w-4 text-blue-600"
              />
              <div className="flex items-center gap-3">
                <img alt="visa" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/visa.sxIq5Dot.svg" width="38" height="24" />
                <img alt="master" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/master.CzeoQWmc.svg" width="38" height="24" />
              </div>
              <span>Card</span>
            </label>
            {paymentData.method === "card" && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-700">
                  After clicking 'Complete Purchase', a pop-up will appear asking you to select your saved card or
                  complete purchase with a new credit/debit card. You will be redirected to the Order Confirmation page afterwards.
                </p>
              </div>
            )}
          </div>

          {/* NetBanking */}
          <div className="border rounded-md overflow-hidden">
            <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment-method"
                checked={paymentData.method === "netbanking"}
                onChange={() => handlePaymentChange("method", "netbanking")}
                className="h-4 w-4 text-blue-600"
              />
              <div className="flex items-center gap-3">
                <img alt="netbanking" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/netbanking.C9e9yzjv.svg" width="38" height="24" />
              </div>
              <span>NetBanking</span>
            </label>
            {paymentData.method === "netbanking" && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-700">
                  After clicking 'Complete Purchase', a pop-up will appear 
                  asking you to select your desired bank to complete the purchase. 
                  You will be redirected to the Order Confirmation page afterwards.
                </p>
              </div>
            )}
          </div>
        </div>

        
      </div>

      {/* Billing address */}
      <div>
        <h3 
          className="text-black font-normal mb-3"
          style={{
            fontSize: '18px',
            fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
            fontWeight: 400,
            color: 'rgba(0,0,0,1)'
          }}
        >
          Billing address
        </h3>
        
        {/* Contextual message for Indian users */}
        <p className="text-sm text-gray-600 mb-4">
          For UPI, Card and Net Banking payments, your shipping address will automatically be used for billing. 
          For card payments, a separate billing address may be required by your bank for verification.
        </p>
        
        {/* Checkbox for billing address */}
        <div className="flex items-center space-x-2 mb-4">
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
            className="text-sm font-normal cursor-pointer"
          >
            Billing address is same as shipping address
          </Label>
        </div>

        {/* Show billing address fields only if checkbox is unchecked */}
        {!paymentData.sameAsShipping && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 
              className="text-black font-normal mb-3"
              style={{
                fontSize: '16px',
                fontFamily: 'Jost, -apple-system, Roboto, Jost, sans-serif',
                fontWeight: 400,
                color: 'rgba(0,0,0,1)'
              }}
            >
              Enter Billing Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="billingAddress">Address *</Label>
                <Input
                  id="billingAddress"
                  value={paymentData.billingAddress.address}
                  onChange={(e) => setPaymentData(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, address: e.target.value }
                  }))}
                  className="mt-1"
                  required={!paymentData.sameAsShipping}
                />
              </div>
              <div>
                <Label htmlFor="billingCity">City *</Label>
                <Input
                  id="billingCity"
                  value={paymentData.billingAddress.city}
                  onChange={(e) => setPaymentData(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, city: e.target.value }
                  }))}
                  className="mt-1"
                  required={!paymentData.sameAsShipping}
                />
              </div>
              <div>
                <Label htmlFor="billingState">State *</Label>
                <Select 
                  onValueChange={(value) => setPaymentData(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, state: value }
                  }))} 
                  value={paymentData.billingAddress.state || ""}
                >
                  <SelectTrigger className="mt-1"> 
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="billingPostal">PIN code *</Label>
                <Input
                  id="billingPostal"
                  value={paymentData.billingAddress.postalCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
                    if (value.length <= 6) { // Max 6 digits
                      setPaymentData(prev => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, postalCode: value }
                      }));
                    }
                  }}
                  className="mt-1"
                  placeholder="Enter 6-digit PIN code"
                  required={!paymentData.sameAsShipping}
                />
              </div>
              <div>
                <Label htmlFor="billingCountry">Country *</Label>
                <Select 
                  onValueChange={(value) => setPaymentData(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, country: value }
                  }))} 
                  value={paymentData.billingAddress.country || ""}
                >
                  <SelectTrigger className="mt-1"> 
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

      {/* Submit button rendered in CheckoutPage on the right via form="checkout-form" */}
    </form>
  );
};

export default CheckoutForm;
