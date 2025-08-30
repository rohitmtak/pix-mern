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
      className: "border-0 bg-black text-white",
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
      className: "border-0 bg-black text-white",
    },
    default: {
      variant: "default" as const,
      className: "border-0 bg-black text-white",
    },
  },
};

// Predefined toast functions for consistency
export const showToast = {
  success: (description: string, customTitle?: string, customDuration?: number) =>
    toast({
      title: undefined,
      description,
      duration: customDuration || toastConfig.durations.success,
      variant: toastConfig.styles.success.variant,
      className: toastConfig.styles.success.className,
    }),

  error: (description: string, customTitle?: string, customDuration?: number) =>
    toast({
      title: undefined,
      description,
      duration: customDuration || toastConfig.durations.error,
      variant: toastConfig.styles.error.variant,
      className: toastConfig.styles.error.className,
    }),

  warning: (description: string, customTitle?: string, customDuration?: number) =>
    toast({
      title: undefined,
      description,
      duration: customDuration || toastConfig.durations.warning,
      variant: toastConfig.styles.warning.variant,
      className: toastConfig.styles.warning.className,
    }),

  info: (description: string, customTitle?: string, customDuration?: number) =>
    toast({
      title: undefined,
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
    added: "Item added to cart",
    removed: "Item removed from cart",
    updated: "Quantity updated",
    cleared: "Cart cleared",
    loginRequired: "Please sign in to checkout",
  },
  wishlist: {
    added: "Item added to wishlist",
    removed: "Item removed from wishlist",
    movedToCart: (size: string) => `Item (${size}) added to cart`,
  },
  auth: {
    loginSuccess: "Welcome back",
    logoutSuccess: "Signed out",
    registerSuccess: "Account created",
    loginRequired: "Please sign in",
    welcomeNewUser: "Welcome! Your wishlist has been saved.",
    welcomeBackUser: "Welcome back! Your wishlist synced.",
    welcomeNewUserFallback: "Welcome! Account created.",
    welcomeBackUserFallback: "Welcome back!",
    invalidEmail: "Please enter a valid email",
    passwordTooShort: "Password must be at least 8 characters",
    nameRequired: "Please enter your name",
    requestFailed: "Request failed",
    unexpectedError: "Something went wrong. Please try again.",
  },
  product: {
    outOfStock: "Out of stock",
    sizeRequired: "Please select a size",
    colorRequired: "Please select a color",
    addedToWishlist: "Added to wishlist",
    removedFromWishlist: "Removed from wishlist",
  },
  general: {
    loading: "Loading...",
    saved: "Saved",
    deleted: "Deleted",
    updated: "Updated",
    error: "Something went wrong",
  },
  profile: {
    loggedOut: "Signed out. Cart cleared.",
    profileUpdated: "Profile updated",
    profileUpdateFailed: "Failed to update profile",
    addressUpdated: "Address updated",
    addressUpdateFailed: "Failed to update address",
    addressDeleted: "Address deleted",
    addressDeleteFailed: "Failed to delete address",
    ordersLoadFailed: "Failed to load orders",
  },
};

// Export the main toast function for backward compatibility
export { toast };
