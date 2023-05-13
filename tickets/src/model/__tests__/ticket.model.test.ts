import { describe, test, expect } from '@jest/globals';
import { TicketsModel } from '../ticket.model';
import { createMongoId } from '../../test/utils';
import { TTicketsInstance } from '../../interfaces';
describe('[Ticket Model]', () => {
  let thirdInstance: TTicketsInstance;
  let fourthInstance: TTicketsInstance;

  test('implements optimistic concurrently control', async () => {
    try {
      const userId: string = createMongoId() as string;
      const ticket: TTicketsInstance = await TicketsModel.addition({
        title: 'first ticket',
        price: 100,
        userId,
      });
      expect(ticket).not.toBeFalsy();
      expect(ticket.userId).toEqual(userId);
      expect(ticket.version).toBeDefined();
      expect(ticket.version).toEqual(0);

      const firstInstance = await TicketsModel.findById(ticket.id);
      const secondInstance = await TicketsModel.findById(ticket.id);

      expect(firstInstance).not.toBeFalsy();
      expect(firstInstance.userId).toEqual(userId);
      expect(firstInstance.version).toBeDefined();
      expect(secondInstance).not.toBeFalsy();
      expect(secondInstance.userId).toEqual(userId);
      expect(secondInstance.version).toBeDefined();

      firstInstance.set({ price: 111 });
      await firstInstance.save();

      secondInstance.set({ price: 155 });
      await secondInstance.save();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  test('implements the version number on multiple saves', async () => {
    try {
      const userId: string = createMongoId() as string;
      const ticket: TTicketsInstance = await TicketsModel.addition({
        title: 'first ticket',
        price: 100,
        userId,
      });
      expect(ticket).not.toBeFalsy();
      expect(ticket.userId).toEqual(userId);
      expect(ticket.version).toBeDefined();

      expect(ticket.version).toEqual(0);
      await ticket.save();
      expect(ticket.version).toEqual(1);
      await ticket.save();
      expect(ticket.version).toEqual(2);
    } catch (error) {
      expect(error).not.toBeDefined();
    }
  });
});
