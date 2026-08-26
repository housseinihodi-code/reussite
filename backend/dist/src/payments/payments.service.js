"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const nanoid_1 = require("nanoid");
const stripe_1 = require("stripe");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        const secretKey = this.config.get('stripe.secretKey');
        this.stripe = secretKey && !secretKey.endsWith('xxx') ? new stripe_1.default(secretKey, { apiVersion: '2024-06-20' }) : null;
    }
    async createIntent(buyerId, dto) {
        const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
        if (!order)
            throw new common_1.NotFoundException('Commande introuvable.');
        if (order.buyerId !== buyerId)
            throw new common_1.ForbiddenException();
        if (order.status !== client_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Cette commande a déjà été traitée.');
        }
        if (!this.stripe) {
            await this.prisma.payment.create({
                data: {
                    orderId: order.id,
                    provider: dto.provider,
                    amount: order.totalAmount,
                    currency: order.currency,
                    transactionRef: `demo_${(0, nanoid_1.nanoid)(16)}`,
                    status: client_1.PaymentStatus.CAPTURED,
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
                status: client_1.PaymentStatus.PENDING,
            },
        });
        return { clientSecret: intent.client_secret };
    }
    async markOrderPaid(orderId) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: client_1.OrderStatus.PAID },
            include: { items: true },
        });
        await this.prisma.vehicle.updateMany({
            where: { id: { in: order.items.map((item) => item.vehicleId) } },
            data: { status: client_1.VehicleStatus.SOLD },
        });
    }
    async handleStripeWebhook(rawBody, signature) {
        if (!this.stripe)
            throw new common_1.BadRequestException('Stripe n’est pas configuré.');
        const webhookSecret = this.config.get('stripe.webhookSecret');
        const event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
            const intent = event.data.object;
            const succeeded = event.type === 'payment_intent.succeeded';
            const payment = await this.prisma.payment.findUnique({ where: { transactionRef: intent.id } });
            if (!payment)
                return { received: true };
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: succeeded ? client_1.PaymentStatus.CAPTURED : client_1.PaymentStatus.FAILED,
                    paidAt: succeeded ? new Date() : null,
                    failureReason: succeeded ? null : intent.last_payment_error?.message,
                },
            });
            if (succeeded) {
                await this.markOrderPaid(payment.orderId);
            }
            else {
                await this.prisma.order.update({ where: { id: payment.orderId }, data: { status: client_1.OrderStatus.CANCELLED } });
            }
        }
        return { received: true };
    }
    findByOrder(orderId) {
        return this.prisma.payment.findMany({ where: { orderId } });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map