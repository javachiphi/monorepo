import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@javachiphi-tix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
