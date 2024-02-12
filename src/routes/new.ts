import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
  OrderStatus,
} from '@javachiphi-tix/common';
import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    try {
      const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
      });

      const payment = Payment.build({
        orderId,
        stripeId: charge.id,
      });

      await payment.save();
      res.status(201).send({ success: true });
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(400).send({ error: 'Payment failed' });
    }
  }
);

export { router as createChargeRouter };
