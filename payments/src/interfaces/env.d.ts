declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PORT: string;
    readonly MONGO_URL: string;
    readonly SRV_NAME: string;
    readonly NATS_CLUSTER_ID: string;
    readonly NATS_CLIENT_ID: string;
    readonly NATS_URL: string;
  }
}
