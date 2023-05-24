export interface Order {
  id: string;
  status: string;
  userId: string;
  expiresAt: Date;
  ticket: {
    id: string;
    title: string;
    price: number;
    version: number;
    createAt: Date;
    updateAt: Date;
  };
}
