import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export const Loading = ({ size = "md", text, className }: LoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-black",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-4 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
};
