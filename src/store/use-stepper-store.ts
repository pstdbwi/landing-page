import { IApplication } from "@/types/applicant";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StepperState {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTotalSteps: (steps: number) => void;
  resetStep: () => void;

  applicantDetail: IApplication | null;
  setApplicantDetail: (data: IApplication) => void;
}

const useStepperStore = create<StepperState>()(
  persist(
    (set) => ({
      currentStep: 1,
      totalSteps: 10,
      setCurrentStep: (step: number) => set({ currentStep: step }),
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
        })),
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),
      setTotalSteps: (steps: number) => set({ totalSteps: steps }),
      resetStep: () => set({ currentStep: 0 }),

      applicantDetail: null,
      setApplicantDetail: (data: IApplication) => set({ applicantDetail: data }),
    }),
    {
      name: "stepper-propose-store",
    }
  )
);

export { useStepperStore };
