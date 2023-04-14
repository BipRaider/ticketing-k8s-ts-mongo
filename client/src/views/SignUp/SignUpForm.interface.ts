export interface ISignUpForm {
  email: string;
  password: string;
}

export interface ISignUpSentResponse {
  data: {
    email: string;
    id: string;
    accessToken: string;
  };
}
