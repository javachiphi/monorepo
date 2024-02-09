import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@javachiphi-tix/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // assume that ticket id is mongo db (possibility that ticket service can change etc.)
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Find the ticket the user is trying to order in the database
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure that the ticket is not already reserved
    // ticket reserved = ticket is associated with an order and the order status is not cancelled
    // run query to look at all orders. find an order where the ticket is the ticket we just found *and* the orders status is *not* cancelled
    // if we find an order from that means the ticket *is* reserved

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('ticket is already reserved');
    }
    // calculate an expiration date for this order

    // build the order and save it to the database

    // publish an event saying that an order was created

    res.send({});
  }
);

export { router as newOrderRouter };
