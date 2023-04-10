declare namespace Express {
  interface Session extends CookieSessionInterfaces.CookieSessionObject {
    jwt: {
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface Request {
    session: Session | null;
    sessionOptions: CookieSessionInterfaces.CookieSessionOptions;
    user?: {
      id: string;
      email: string;
    };
  }
}
