import { AdditionalSignupDataType } from "./user";

export interface SignupStepProps {
  initialData: Partial<AdditionalSignupDataType>;
  goNextStep: (data: Partial<AdditionalSignupDataType>) => void;
  handlePrevStep?: () => void;
}
