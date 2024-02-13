import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@javachiphi-tix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
