import mongoose, { Connection } from 'mongoose';

import { IOrdersModel } from '@src/interfaces';
import { OrdersModel } from '@src/model';

export class MongoService {
  private client: typeof mongoose;
  private db: Connection;
  private url: string;

  private _orders: IOrdersModel;

  constructor() {
    this.client = mongoose;
    this.url = process.env['MONGO_URL'];

    this._orders = OrdersModel;
  }
  /*** Connect to the `mongodb` database */
  async connect(): Promise<void> {
    try {
      await this.client.connect(this.url);

      this.db = this.client.connection;

      console.log(`Connected to MongoDB: ${this.client.connection.host}`);
      this.db.on('connecting', (): void => console.log(`Connecting to MongoDB...`));
      this.db.on('connected', (): void => console.log(`Connected to MongoDB!`));
      this.db.on('reconnected', (): void => console.log(`Reconnected to MongoDB!`));
      this.db.once('open', (): void => console.log(`Open to MongoDB!`));

      this.db.on('disconnected', (): void => {
        console.log(`Disconnected to MongoDB!`);
        setTimeout(async (): Promise<void> => {
          await this.client.connect(this.url);
        }, 5000);
      });

      this.db.on('error', async (error: Error): Promise<void> => {
        console.error(`Failed to connect MongoDB : ${error.message} `);
        await this.disconnect();
      });
    } catch (e) {
      if (e instanceof Error) {
        console.error(`Failed to connect MongoDB : ${e.message} `);
        setTimeout(async (): Promise<void> => {
          await this.client.connect(this.url);
        }, 5000);
      }
    }
  }

  /*** Disconnect from the `mongodb` database */
  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }
  /** Works with `OrdersModel` from mongodb database */
  get orders(): IOrdersModel {
    return this._orders;
  }
}
