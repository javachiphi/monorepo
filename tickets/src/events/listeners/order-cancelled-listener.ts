import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from '@javachiphi-tix/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    //find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    //if the ticket is not found, throw an error

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark the ticket not reserved by setting its orderId property to undefined
    ticket.set({ orderId: undefined });
    // save the ticket
    await ticket.save();
    // emit event to update the version of the ticket
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    // ack the message
    msg.ack();
  }
}
