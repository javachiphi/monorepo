import { Publisher, OrderCreatedEvent, Subjects } from '@javachiphi-tix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
