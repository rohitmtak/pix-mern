import { toast } from "react-toastify";

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
};

// Predefined toast functions for consistency
export const showToast = {
  success: (description: string, customTitle?: string, customDuration?: number) =>
    toast.success(description, {
      autoClose: customDuration || toastConfig.durations.success,
    }),

  error: (description: string, customTitle?: string, customDuration?: number) =>
    toast.error(description, {
      autoClose: customDuration || toastConfig.durations.error,
    }),

  warning: (description: string, customTitle?: string, customDuration?: number) =>
    toast.warning(description, {
      autoClose: customDuration || toastConfig.durations.warning,
    }),

  info: (description: string, customTitle?: string, customDuration?: number) =>
    toast.info(description, {
      autoClose: customDuration || toastConfig.durations.info,
    }),

  // Custom toast with full control
  custom: (config: {
    title: string;
    description: string;
    duration?: number;
    variant?: "default" | "destructive" | "success" | "warning" | "info";
    className?: string;
  }) =>
    toast(config.description, {
      autoClose: config.duration || toastConfig.durations.default,
      type: config.variant === "destructive" ? "error" : config.variant || "default",
    }),
};

// Common toast messages for consistency
export const toastMessages = {
  cart: {
    added: "Item added to cart",
    removed: "Item removed from cart",
    updated: "Item quantity updated",
    cleared: "Cart cleared",
    loginRequired: "Please sign in to checkout",
  },
  wishlist: {
    added: "Item added to wishlist",
    removed: "Item removed from wishlist",
    movedToCart: (size: string) => `Item (${size}) added to cart`,
  },
  auth: {
    loginSuccess: "Logged in successfully",
    logoutSuccess: "Logged out successfully",
    registerSuccess: "Account created successfully",
    loginRequired: "Please log in",
    welcomeNewUser: "Welcome! Your account has been created.",
    welcomeBackUser: "Welcome back!",
    welcomeNewUserWithWishlist: "Welcome! Your wishlist has been saved.",
    welcomeBackUserWithWishlist: "Welcome back! Your wishlist synced.",
    invalidEmail: "Please enter a valid email",
    passwordTooShort: "Password must be at least 8 characters",
    nameRequired: "Please enter your name",
    requestFailed: "Request failed",
    unexpectedError: "Something went wrong. Please try again.",
  },
  product: {
    outOfStock: "Item is out of stock",
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
    profileUpdated: "Profile updated successfully",
    profileUpdateFailed: "Failed to update profile",
    addressUpdated: "Address updated successfully",
    addressUpdateFailed: "Failed to update address",
    addressDeleted: "Address deleted",
    addressDeleteFailed: "Failed to delete address",
    ordersLoadFailed: "Failed to load orders",
  },
};

// Export the main toast function for backward compatibility
export { toast };
