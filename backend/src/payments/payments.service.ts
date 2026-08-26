import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, PaymentStatus, VehicleStatus } from '@prisma/client';
import { nanoid } from 'nanoid';
import Stripe from 'stripe';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe | null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const secretKey = this.config.get<string>('stripe.secretKey');
    // Without a real secret key (unset, or the "sk_test_xxx" placeholder from
    // .env.example), Stripe calls would fail outright and checkout would be
    // stuck — so orders are simulated as paid immediately instead. Once real
    // keys are configured, the normal Stripe flow takes over automatically.
    this.stripe = secretKey && !secretKey.endsWith('xxx') ? new Stripe(secretKey, { apiVersion: '2024-06-20' }) : null;
  }

  async createIntent(buyerId: string, dto: CreatePaymentIntentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Commande introuvable.');
    if (order.buyerId !== buyerId) throw new ForbiddenException();
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Cette commande a déjà été traitée.');
    }

    if (!this.stripe) {
      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          provider: dto.provider,
          amount: order.totalAmount,
          currency: order.currency,
          transactionRef: `demo_${nanoid(16)}`,
          status: PaymentStatus.CAPTURED,
          paidAt: new Date(),
        },
      });
      await this.markOrderPaid(order.id);
      return { clientSecret: null };
    }

    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: order.currency.toLowerCase(),
      metadata: { orderId: order.id },
      automatic_payment_methods: { enabled: true },
    });

    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        provider: dto.provider,
        amount: order.totalAmount,
        currency: order.currency,
        transactionRef: intent.id,
        status: PaymentStatus.PENDING,
      },
    });

    return { clientSecret: intent.client_secret };
  }

  private async markOrderPaid(orderId: string) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PAID },
      include: { items: true },
    });
    await this.prisma.vehicle.updateMany({
      where: { id: { in: order.items.map((item) => item.vehicleId) } },
      data: { status: VehicleStatus.SOLD },
    });
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    if (!this.stripe) throw new BadRequestException('Stripe n’est pas configuré.');
    const webhookSecret = this.config.get<string>('stripe.webhookSecret')!;
    const event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const succeeded = event.type === 'payment_intent.succeeded';

      const payment = await this.prisma.payment.findUnique({ where: { transactionRef: intent.id } });
      if (!payment) return { received: true };

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: succeeded ? PaymentStatus.CAPTURED : PaymentStatus.FAILED,
          paidAt: succeeded ? new Date() : null,
          failureReason: succeeded ? null : intent.last_payment_error?.message,
        },
      });

      if (succeeded) {
        await this.markOrderPaid(payment.orderId);
      } else {
        await this.prisma.order.update({ where: { id: payment.orderId }, data: { status: OrderStatus.CANCELLED } });
      }
    }

    return { received: true };
  }

  findByOrder(orderId: string) {
    return this.prisma.payment.findMany({ where: { orderId } });
  }
}
