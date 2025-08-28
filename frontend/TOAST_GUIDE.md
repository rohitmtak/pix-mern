# Toast System Guide

This guide explains how to use the centralized toast system for consistent messaging across all pages in the application.

## Overview

The toast system provides:
- **Consistent styling** across all pages
- **Predefined message templates** for common actions
- **Easy customization** when needed
- **Type safety** with TypeScript

## Quick Start

### 1. Import the Toast Functions

```typescript
import { showToast, toastMessages } from "@/config/toastConfig";
```

### 2. Use Predefined Toast Types

```typescript
// Success toast (green)
showToast.success("Operation completed successfully!");

// Error toast (red)
showToast.error("Something went wrong!");

// Warning toast (yellow)
showToast.warning("Please check your input");

// Info toast (blue)
showToast.info("Here's some information");
```

## Toast Types and Styling

### Success Toasts
- **Color**: Green theme
- **Duration**: 3 seconds (default)
- **Use case**: Confirmations, successful operations

```typescript
showToast.success("Product added to cart!");
```

### Error Toasts
- **Color**: Red theme
- **Duration**: 4 seconds (default)
- **Use case**: Errors, failed operations

```typescript
showToast.error("Failed to save changes");
```

### Warning Toasts
- **Color**: Yellow theme
- **Duration**: 3.5 seconds (default)
- **Use case**: Warnings, user attention needed

```typescript
showToast.warning("Please select a size");
```

### Info Toasts
- **Color**: Blue theme
- **Duration**: 3 seconds (default)
- **Use case**: Information, status updates

```typescript
showToast.info("Processing your request...");
```

## Predefined Messages

Use predefined message templates for consistency:

### Cart Messages
```typescript
showToast.success(toastMessages.cart.added("Nike Shoes"));
showToast.success(toastMessages.cart.removed("Adidas Shirt"));
showToast.success(toastMessages.cart.updated("Product Name"));
showToast.success(toastMessages.cart.cleared);
```

### Wishlist Messages
```typescript
showToast.success(toastMessages.wishlist.added("Product Name"));
showToast.info(toastMessages.wishlist.removed("Product Name"));
showToast.success(toastMessages.wishlist.movedToCart("Product Name", "M"));
```

### Auth Messages
```typescript
showToast.success(toastMessages.auth.loginSuccess);
showToast.success(toastMessages.auth.logoutSuccess);
showToast.success(toastMessages.auth.registerSuccess);
showToast.error(toastMessages.auth.loginRequired);
```

### Product Messages
```typescript
showToast.error(toastMessages.product.outOfStock);
showToast.warning(toastMessages.product.sizeRequired);
showToast.warning(toastMessages.product.colorRequired);
```

## Customization

### Override Default Values

```typescript
// Override duration
showToast.success("Quick message", undefined, 1500);

// Override title
showToast.success("Message", "Custom Title");

// Override both
showToast.success("Message", "Custom Title", 2000);
```

### Full Custom Control

```typescript
showToast.custom({
  title: "Custom Title",
  description: "Custom message",
  duration: 5000,
  variant: "success", // or "error", "warning", "info", "default"
  className: "border-purple-200 bg-purple-50 text-purple-800",
});
```

## Configuration

### Toast Durations
```typescript
import { toastConfig } from "@/config/toastConfig";

console.log(toastConfig.durations.success); // 3000ms
console.log(toastConfig.durations.error);   // 4000ms
console.log(toastConfig.durations.warning); // 3500ms
console.log(toastConfig.durations.info);    // 3000ms
```

### Toast Styles
```typescript
console.log(toastConfig.styles.success.variant); // "success"
console.log(toastConfig.styles.success.className); // "border-green-200 bg-green-50 text-green-800"
```

## Migration from Old System

### Before (Inconsistent)
```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Added to Cart",
  description: "Product added successfully",
  duration: 3000,
});
```

### After (Consistent)
```typescript
import { showToast, toastMessages } from "@/config/toastConfig";

showToast.success(toastMessages.cart.added("Product Name"));
```

## Best Practices

### 1. Use Predefined Messages
```typescript
// ✅ Good - Consistent messaging
showToast.success(toastMessages.cart.added(productName));

// ❌ Avoid - Inconsistent messaging
showToast.success("Product added to cart!");
```

### 2. Choose Appropriate Toast Types
```typescript
// ✅ Success for confirmations
showToast.success("Order placed successfully");

// ✅ Error for failures
showToast.error("Payment failed");

// ✅ Warning for user attention
showToast.warning("Please select a size");

// ✅ Info for status updates
showToast.info("Processing payment...");
```

### 3. Keep Messages Concise
```typescript
// ✅ Good - Clear and concise
showToast.success("Item added to cart");

// ❌ Avoid - Too verbose
showToast.success("The item you selected has been successfully added to your shopping cart");
```

### 4. Use Consistent Language
```typescript
// ✅ Good - Consistent terminology
showToast.success(toastMessages.wishlist.added("Product"));

// ❌ Avoid - Inconsistent terminology
showToast.success("Product saved to favorites");
```

## Examples by Use Case

### Product Management
```typescript
// Add to cart
showToast.success(toastMessages.cart.added(product.name));

// Remove from cart
showToast.success(toastMessages.cart.removed(product.name));

// Out of stock
showToast.error(toastMessages.product.outOfStock);
```

### User Actions
```typescript
// Login success
showToast.success(toastMessages.auth.loginSuccess);

// Form validation
showToast.warning("Please fill in all required fields");

// Save success
showToast.success("Changes saved successfully");
```

### System Messages
```typescript
// Loading state
showToast.info("Loading products...");

// Network error
showToast.error("Failed to connect to server");

// Success confirmation
showToast.success("Operation completed successfully");
```

## Troubleshooting

### Toast Not Showing
1. Check if `Toaster` component is imported in your main App
2. Verify the import path is correct
3. Check browser console for errors

### Styling Issues
1. Ensure CSS classes are not being overridden
2. Check if Tailwind CSS is properly configured
3. Verify toast variant is correctly set

### Type Errors
1. Make sure TypeScript is properly configured
2. Check import statements
3. Verify function signatures match expected types

## Need Help?

- Check the example file: `src/examples/toastUsage.ts`
- Review the configuration: `src/config/toastConfig.ts`
- Look at existing implementations in other pages
- Check the toast component: `src/components/ui/toast.tsx`
