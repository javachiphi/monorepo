import { OrderCreatedEvent, OrderStatus } from '@javachiphi-tix/common';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Build a listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a ticket & save
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });

  await ticket.save();

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('ack the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  // call the onMessage function with the data object + message object
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket updated event is published
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  //console.log((natsWrapper.client.publish as jest.Mock).mock.calls);
});
