"use client";

import { cn } from "@/lib/utils";
import { useStepperStore } from "@/store/use-stepper-store";

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
}

export const Stepper: React.FC<StepperProps> = ({ steps }) => {
  const { currentStep, setCurrentStep } = useStepperStore();

  return (
    <div className="flex justify-center w-full ">
      <div className="flex items-center justify-between w-full relative ">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div
              key={index}
              className="relative flex flex-col items-center flex-1 "
              onClick={() => setCurrentStep(stepNumber)}
            >
              {/* Connector line (except last step) */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-1/2 w-full h-[2px] -translate-y-1/2 z-0 mx-4",
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition-colors cursor-pointer",
                  isActive
                    ? "bg-green-600 text-white border-green-600 shadow-md"
                    : isCompleted
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-100 text-gray-500 border-gray-300 hover:border-green-400"
                )}
              >
                {stepNumber}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-sm text-center whitespace-nowrap",
                  isActive ? "text-green-600 font-medium" : isCompleted ? "text-green-500" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
