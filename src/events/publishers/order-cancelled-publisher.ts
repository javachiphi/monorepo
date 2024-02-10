import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@javachiphi-tix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
