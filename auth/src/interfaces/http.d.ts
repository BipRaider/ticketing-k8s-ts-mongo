declare namespace Express {
  //TODO:
  interface Request {
    session?: {
      jwt: {
        accessToken?: string;
        refreshToken?: string;
      };
    };
  }
  interface Session {
    jwt: {
      accessToken?: string;
      refreshToken?: string;
    };
  }
}
