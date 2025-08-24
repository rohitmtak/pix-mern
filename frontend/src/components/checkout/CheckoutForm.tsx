import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
  className?: string;
}

const CheckoutForm = ({ onSubmit, className }: CheckoutFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    saveInfo: false,
    sameAsShipping: true
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    billingAddress: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, payment: paymentData });
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)}>
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
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="save-info"
              checked={formData.saveInfo}
              onCheckedChange={(checked) => handleInputChange("saveInfo", checked as string)}
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
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
            <Input
              id="apartment"
              value={formData.apartment}
              onChange={(e) => handleInputChange("apartment", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Select onValueChange={(value) => handleInputChange("state", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="kolkata">Kolkata</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Select onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="canada">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
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
          Payment Information
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input
              id="nameOnCard"
              value={paymentData.nameOnCard}
              onChange={(e) => handlePaymentChange("nameOnCard", e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <Button 
          type="submit"
          className="w-full h-12 text-lg font-medium bg-black text-white hover:bg-gray-800"
        >
          COMPLETE ORDER
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
