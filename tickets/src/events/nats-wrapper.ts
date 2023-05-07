import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  constructor() {}

  public get client(): Stan {
    if (!this._client) {
      throw new Error('Cannot access to Nats client before connecting.');
    }
    return this._client;
  }

  connect = async (clusterID: string, clientID: string, opts?: nats.StanOptions): Promise<void> => {
    this._client = nats.connect(clusterID, clientID, opts);

    return await new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this.client.on('error', err => {
        reject(err);
      });
    });
  };
  /** Listening event of a close.*/
  public closeEvent = () => {
    this.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => this.client.close());
    process.on('SIGTERM', () => this.client.close());
  };
}

export const natsWrapper = new NatsWrapper();
