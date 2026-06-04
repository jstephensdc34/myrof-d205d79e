
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading items..." }: LoadingStateProps) => {
  return (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
      <span className="ml-2 text-lg text-medical-600">{message}</span>
    </div>
  );
};
