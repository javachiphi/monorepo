import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from '@javachiphi-tix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
