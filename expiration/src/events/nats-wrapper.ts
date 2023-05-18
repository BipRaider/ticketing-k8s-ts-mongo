import nats, { Stan } from 'node-nats-streaming';

import { ErrorEx } from '@bipdev/common';

import { OrderCreatedListenerEvent, OrderCancelledListenerEvent } from './listners';

class NatsWrapper {
  private _client?: Stan;

  constructor() {}

  public get client(): Stan {
    if (!this._client) {
      throw new Error('Cannot access to Nats client before connecting.');
    }
    return this._client;
  }

  public init = async (clusterID: string, clientID: string, opts?: nats.StanOptions) => {
    await this.connect(clusterID, clientID, opts);
    this.listeners();
    this.closeEvent();
  };

  connect = async (clusterID: string, clientID: string, opts?: nats.StanOptions): Promise<void> => {
    if (!clusterID) throw new ErrorEx('Nats clasterId must be defined', 'Nats clasterId must be defined', 403);
    if (!clientID) throw new ErrorEx('Nats cliendId must be defined', 'Nats cliendId must be defined', 403);
    if (!opts.url) throw new ErrorEx('Nats url must be defined', 'Nats url must be defined', 403);

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
  /** Running the listeners */
  public listeners = (): void => {
    new OrderCreatedListenerEvent(this.client).listen();
    new OrderCancelledListenerEvent(this.client).listen();
  };
}

export const natsWrapper = new NatsWrapper();
