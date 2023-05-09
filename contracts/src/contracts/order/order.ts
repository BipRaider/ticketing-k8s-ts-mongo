export enum OrdersStatus {
  /*** When the orted  has been created.
   **  But the ticket it is trying to orden has not been reserved.
   */
  Created = 'created',
  /*** The ticket the order is trying to reserve has already been reserved
   **  Or when the user canselled the order
   **  The order expires before payment
   */
  Cansellet = 'cansellet',
  /*** The order has reserved the ticket.
   ** And the user has provided payment successfully
   */
  Complete = 'complete',
  /*** The order has successfully reserved the ticket. */
  AwaitingPayment = 'awaiting:payment',
}
