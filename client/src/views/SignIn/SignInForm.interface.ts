export interface ISignInForm {
  email: string;
  password: string;
}

export interface ISignInSentResponse {
  data: {
    email: string;
    id: string;
    accessToken: string;
  };
}
