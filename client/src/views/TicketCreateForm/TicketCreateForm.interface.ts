export interface ITicketCreateForm {
  price: string;
  title: string;
}

export interface ITicketCreateSentResponse {
  data: {
    title: string;
    price: number;
    userId: string;
    version: number;
    id: string;
  };
}
