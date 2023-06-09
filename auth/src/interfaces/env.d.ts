declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PORT: string;
    readonly JWT_SALT: string;
    readonly MONGO_URL: string;
  }
}
