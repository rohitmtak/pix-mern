import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export const Error = ({ 
  title = "Something went wrong", 
  message = "An error occurred. Please try again.", 
  onRetry, 
  retryText = "Retry",
  className 
}: ErrorProps) => {
  return (
    <div className={cn("text-center py-8", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {retryText}
        </Button>
      )}
    </div>
  );
};
