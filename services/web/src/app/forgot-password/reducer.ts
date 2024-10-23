export enum PasswordResetStep {
  SendOtp = 1,
  VerifyOtp,
  NewPassword,
  Completed,
}

export type PasswordResetState = {
  step: PasswordResetStep;
  transactionId: string;
  email: string;
};

export type PasswordResetAction =
  | {
      type: "SEND_OTP_TO_VERIFY_OTP";
      transactionId: string;
      email: string;
    }
  | {
      type: "VERIFY_OTP_TO_NEW_PASSWORD";
    }
  | {
      type: "COMPLETE";
    };

export const reducer = (
  state: PasswordResetState,
  action: PasswordResetAction,
): PasswordResetState => {
  switch (action.type) {
    case "SEND_OTP_TO_VERIFY_OTP":
      return {
        ...state,
        step: PasswordResetStep.VerifyOtp,
        transactionId: action.transactionId,
        email: action.email,
      };
    case "VERIFY_OTP_TO_NEW_PASSWORD":
      return {
        ...state,
        step: PasswordResetStep.NewPassword,
      };
    case "COMPLETE":
      return {
        ...state,
        step: PasswordResetStep.Completed,
      };
    default:
      return state;
  }
};
