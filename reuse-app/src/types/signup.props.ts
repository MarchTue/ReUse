export interface SignupStepProps<T = any> {
  goNextStep: (data: T) => void;
  initialData: T;
  isProcessing?: boolean;
  handlePrevStep?: () => void;
}