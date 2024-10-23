export enum RegistrationStep {
  SendOtp = 1,
  VerifyOtp,
  FillInfo,
  Completed,
}

export type RegistrationState = {
  step: RegistrationStep;
  transactionId: string;
  email: string;
};

export type RegistrationAction =
  | {
      type: "SEND_OTP_TO_VERIFY_OTP";
      transactionId: string;
      email: string;
    }
  | {
      type: "VERIFY_OTP_TO_FILL_INFO";
    }
  | {
      type: "COMPLETE";
    };

export const reducer = (
  state: RegistrationState,
  action: RegistrationAction,
): RegistrationState => {
  switch (action.type) {
    case "SEND_OTP_TO_VERIFY_OTP":
      return {
        ...state,
        step: RegistrationStep.VerifyOtp,
        transactionId: action.transactionId,
        email: action.email,
      };
    case "VERIFY_OTP_TO_FILL_INFO":
      return {
        ...state,
        step: RegistrationStep.FillInfo,
      };
    case "COMPLETE":
      return {
        ...state,
        step: RegistrationStep.Completed,
      };
    default:
      return state;
  }
};
