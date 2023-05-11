export enum OrdersStatus {
  /*** When the order  has been created.
   **  But the ticket it is trying to order has not been reserved.
   */
  Created = 'created',
  /*** The ticket the order is trying to reserve has already been reserved
   **  Or when the user cancelled the order
   **  The order expires before payment
   */
  Cancelled = 'cancelled',
  /*** The order has reserved the ticket.
   ** And the user has provided payment successfully
   */
  Complete = 'complete',
  /*** The order has successfully reserved the ticket. */
  AwaitingPayment = 'awaiting:payment',
}
