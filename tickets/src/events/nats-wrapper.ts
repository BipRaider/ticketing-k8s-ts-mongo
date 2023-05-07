import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;
  constructor() {}

  connect = async (clusterID: string, clientID: string, opts?: nats.StanOptions): Promise<void> => {
    this._client = nats.connect(clusterID, clientID, opts);

    return await new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this._client!.on('error', err => {
        reject(err);
      });
    });
  };

  public get client(): Stan {
    return this._client;
  }
}

export const natsWrapper = new NatsWrapper();
