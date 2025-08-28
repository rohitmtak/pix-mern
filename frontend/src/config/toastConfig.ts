import { toast } from "@/hooks/use-toast";

// Toast configuration for consistent styling across the application
export const toastConfig = {
  // Default durations for different toast types
  durations: {
    success: 3000,
    error: 4000,
    warning: 3500,
    info: 3000,
    default: 3000,
  },

  // Predefined toast styles
  styles: {
    success: {
      variant: "success" as const,
      className: "border-green-200 bg-green-50 text-green-800",
    },
    error: {
      variant: "destructive" as const,
      className: "border-red-200 bg-red-50 text-red-800",
    },
    warning: {
      variant: "warning" as const,
      className: "border-yellow-200 bg-yellow-50 text-yellow-800",
    },
    info: {
      variant: "info" as const,
      className: "border-blue-200 bg-blue-50 text-blue-800",
    },
    default: {
      variant: "default" as const,
      className: "border-gray-200 bg-gray-50 text-gray-800",
    },
  },
};

// Predefined toast functions for consistency
export const showToast = {
  success: (description: string, customTitle?: string, customDuration?: number) =>
    toast({
      title: customTitle || "Success",
      description,
      duration: customDuration || toastConfig.durations.success,
      variant: toastConfig.styles.success.variant,
      className: toastConfig.styles.success.className,
    }),

  error: (description: string, customTitle?: string, customDuration?: number) =>
    toast({
      title: customTitle || "Error",
      description,
      duration: customDuration || toastConfig.durations.error,
      variant: toastConfig.styles.error.variant,
      className: toastConfig.styles.error.className,
    }),

  warning: (description: string, customTitle?: string, customDuration?: number) =>
    toast({
      title: customTitle || "Warning",
      description,
      duration: customDuration || toastConfig.durations.warning,
      variant: toastConfig.styles.warning.variant,
      className: toastConfig.styles.warning.className,
    }),

  info: (description: string, customTitle?: string, customDuration?: number) =>
    toast({
      title: customTitle || "Info",
      description,
      duration: customDuration || toastConfig.durations.info,
      variant: toastConfig.styles.info.variant,
      className: toastConfig.styles.info.className,
    }),

  // Custom toast with full control
  custom: (config: {
    title: string;
    description: string;
    duration?: number;
    variant?: "default" | "destructive" | "success" | "warning" | "info";
    className?: string;
  }) =>
    toast({
      title: config.title,
      description: config.description,
      duration: config.duration || toastConfig.durations.default,
      variant: config.variant || "default",
      className: config.className,
    }),
};

// Common toast messages for consistency
export const toastMessages = {
  cart: {
    added: (productName: string) => `${productName} has been added to your cart successfully!`,
    removed: (productName: string) => `${productName} has been removed from your cart`,
    updated: (productName: string) => `Quantity updated for ${productName}`,
    cleared: "Your cart has been cleared",
    loginRequired: "Please log in to proceed with checkout",
  },
  wishlist: {
    added: (productName: string) => `${productName} added to your wishlist`,
    removed: (productName: string) => `${productName} removed from your wishlist`,
    movedToCart: (productName: string, size: string) => `${productName} (${size}) added to your cart`,
  },
  auth: {
    loginSuccess: "Successfully logged in",
    logoutSuccess: "Successfully logged out",
    registerSuccess: "Account created successfully",
    loginRequired: "Please log in to continue",
    welcomeNewUser: "Welcome! Your account has been created and wishlist saved.",
    welcomeBackUser: "Welcome back! Your wishlist has been synced.",
    welcomeNewUserFallback: "Welcome! Your account has been created successfully.",
    welcomeBackUserFallback: "Welcome back! Login successful.",
    invalidEmail: "Please enter a valid email address.",
    passwordTooShort: "Password must be at least 8 characters.",
    nameRequired: "Please enter your name.",
    requestFailed: "Request failed",
    unexpectedError: "An unexpected error occurred. Please try again.",
  },
  product: {
    outOfStock: "This product is currently out of stock",
    sizeRequired: "Please select a size",
    colorRequired: "Please select a color",
    addedToWishlist: "Product added to wishlist",
    removedFromWishlist: "Product removed from wishlist",
  },
  general: {
    loading: "Loading...",
    saved: "Changes saved successfully",
    deleted: "Item deleted successfully",
    updated: "Item updated successfully",
    error: "Something went wrong. Please try again.",
  },
  profile: {
    loggedOut: "Logged out successfully. Your cart has been cleared.",
    profileUpdated: "Profile updated successfully",
    profileUpdateFailed: "Failed to update profile",
    addressUpdated: "Address updated successfully",
    addressUpdateFailed: "Failed to update address",
    addressDeleted: "Address deleted successfully",
    addressDeleteFailed: "Failed to delete address",
    ordersLoadFailed: "Failed to load orders",
  },
};

// Export the main toast function for backward compatibility
export { toast };
