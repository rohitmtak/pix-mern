import React, { useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '@/lib/utils';

interface PhoneNumberInputProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  label?: string;
  required?: boolean;
}

const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
];

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  id,
  value = '',
  onChange,
  placeholder = 'Phone number',
  className,
  error = false,
  label,
  required = false,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Parse the current value to extract country code and phone number
  React.useEffect(() => {
    if (value) {
      // Check if value starts with a country code
      const matchedCountry = countryCodes.find(country => 
        value.startsWith(country.code)
      );
      
      if (matchedCountry) {
        setSelectedCountryCode(matchedCountry.code);
        setPhoneNumber(value.substring(matchedCountry.code.length));
      } else {
        // If no country code, assume it's just the phone number
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleCountryCodeChange = (newCountryCode: string) => {
    setSelectedCountryCode(newCountryCode);
    const fullNumber = newCountryCode + phoneNumber;
    onChange?.(fullNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow digits, max 10 characters for most countries
    const digitsOnly = inputValue.replace(/[^0-9]/g, '');
    const maxLength = selectedCountryCode === '+1' ? 10 : 10; // Adjust based on country
    
    if (digitsOnly.length <= maxLength) {
      setPhoneNumber(digitsOnly);
      const fullNumber = selectedCountryCode + digitsOnly;
      onChange?.(fullNumber);
    }
  };

  const selectedCountry = countryCodes.find(country => country.code === selectedCountryCode);

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label htmlFor={id} className="text-xs sm:text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className={cn(
        "flex border rounded-md overflow-hidden",
        error ? "border-red-500" : "border-gray-300 focus-within:border-black"
      )}>
        {/* Country Code Selector */}
        <div className="flex items-center bg-gray-50 border-r border-gray-300 px-2 py-2 min-w-[90px]">
          <Select value={selectedCountryCode} onValueChange={handleCountryCodeChange}>
            <SelectTrigger className="border-0 bg-transparent p-0 h-auto focus:ring-0 focus:ring-offset-0">
              <SelectValue>
                <span className="text-sm font-medium text-gray-700">{selectedCountryCode}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{country.code}</span>
                    <span className="text-gray-500 text-sm">{country.country}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phone Number Input */}
        <Input
          id={id}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          className={cn(
            "border-0 rounded-none focus:ring-0 focus:ring-offset-0 h-9 sm:h-10 text-sm sm:text-base",
            error && "border-red-500"
          )}
        />
      </div>
      
    </div>
  );
};

export default PhoneNumberInput;
