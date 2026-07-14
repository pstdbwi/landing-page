import { Clock } from "lucide-react";
import { Label } from "../Label";

export const ErrorPage = () => {
  return (
    <div className="min-h-[50vh] grid place-items-center">
      <div className="flex flex-col gap-3 items-center justify-center">
        <Clock className="w-10 h-10 text-gray-600" />
        <Label className="text-sm text-gray-600">
          Oops! Ada kendala pada server. Silakan coba beberapa saat lagi..
        </Label>
      </div>
    </div>
  );
};
