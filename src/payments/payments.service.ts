import { Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { envConfig } from 'src/config/envs';
import Stripe from 'stripe';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/transport/service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(@Inject(NATS_SERVICE) private client: ClientProxy) {
    this.stripe = new Stripe(envConfig.stripeSecretKey);
  }

  async processPayment(processPaymentDto: ProcessPaymentDto) {
    const { currency, items, orderId } = processPaymentDto;

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.amount,
      },
      quantity: item.quantity,
    }));

    return await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      success_url: envConfig.successUrl,
      cancel_url: envConfig.cancelUrl,
    });
  }

  approvedPayments() {
    return { message: 'List of approved payments' };
  }

  canceledPayments() {
    return { message: 'List of canceled payments' };
  }

  webhookStatus(req: Request, res: Response) {
    const endPointSecret = envConfig.stripeSecretEndPointKey;
    const signature = req.headers['stripe-signature'];
    let event;

    if (signature) {
      try {
        event = this.stripe.webhooks.constructEvent(
          req['rawBody'],
          signature,
          endPointSecret,
        );
      } catch (err) {
        console.log(` Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }

    switch (event.type) {
      case 'charge.succeeded':
        const charge = event.data.object;
        this.client.emit('updateOrderReceipt', {
          orderId: charge.metadata.orderId,
          paymentId: charge.id,
          receiptUrl: charge.receipt_url,
        });
        break;
      default:
    }

    return res.status(200).json({ signature });
  }
}
