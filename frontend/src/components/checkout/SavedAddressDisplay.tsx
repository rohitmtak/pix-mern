import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';
import { getStateName, getCountryName } from '@/utils/addressUtils';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

interface SavedAddressDisplayProps {
  addresses: Address[];
  onAddNewAddress: () => void;
  selectedAddressId?: string;
  showAddButton?: boolean;
}

const SavedAddressDisplay: React.FC<SavedAddressDisplayProps> = ({
  addresses,
  onAddNewAddress,
  selectedAddressId,
  showAddButton = true
}) => {
  const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
  const selectedAddress = selectedAddressId 
    ? addresses.find(addr => addr.id === selectedAddressId) 
    : defaultAddress;

  if (!selectedAddress) {
    return (
      <div className="text-center py-8">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Address</h3>
        <p className="text-gray-500 mb-4">Add an address to speed up your checkout</p>
        <Button 
          variant="outline"
          onClick={onAddNewAddress} 
          className="border-gray-300 hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Address Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Choose Your Address</h3>
        </div>

        {/* Address Options */}
        {addresses.map((address, index) => (
          <div key={address.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id={`address-${address.id}`}
                name="selectedAddress"
                value={address.id}
                defaultChecked={address.isDefault || index === 0}
                onChange={() => {
                  // Dispatch event to notify parent component about address selection
                  window.dispatchEvent(new CustomEvent('address-selected', { 
                    detail: { addressId: address.id, address } 
                  }));
                }}
                className="w-4 h-4 text-black border-gray-300 focus:ring-black mt-1"
              />
              <label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-lg">{address.fullName}</p>
                    {address.isDefault && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-gray-600">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>{address.city}, {getStateName(address.state)} {address.postalCode}</p>
                    <p>{getCountryName(address.country)}</p>
                    <p>{address.phone}</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Address Button - only show if showAddButton is true */}
      {showAddButton && (
        <div className="flex justify-start pt-2">
          <Button 
            variant="outline"
            onClick={onAddNewAddress}
            className="border-gray-300 hover:bg-gray-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Address
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedAddressDisplay;
