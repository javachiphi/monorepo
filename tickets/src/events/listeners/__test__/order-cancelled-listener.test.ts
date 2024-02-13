import { OrderCancelledEvent } from '@javachiphi-tix/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // build a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create & save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'asdf',
  });

  ticket.set({ orderId });
  await ticket.save();
  // create an order
  // create a fake data event

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, orderId, data, msg };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was updated
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();

  // write assertions to make sure an event is published
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
