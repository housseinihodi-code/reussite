import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(buyerId: string, dto: CreateOrderDto): Promise<{
        items: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        billingAddressId: string | null;
        shippingAddressId: string | null;
        notes: string | null;
        orderNumber: string;
        subtotal: number;
        taxAmount: number;
        shippingAmount: number;
        totalAmount: number;
        buyerId: string;
    }>;
    findAllForBuyer(buyerId: string): import(".prisma/client").Prisma.PrismaPromise<({
        items: ({
            vehicle: {
                images: {
                    id: string;
                    createdAt: Date;
                    url: string;
                    altText: string | null;
                    position: number;
                    isPrimary: boolean;
                    vehicleId: string;
                }[];
            } & {
                isFeatured: boolean;
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                country: string;
                currency: string;
                slug: string;
                brandId: string;
                title: string;
                vin: string | null;
                year: number;
                price: number;
                mileage: number;
                mileageUnit: string;
                fuelType: import(".prisma/client").$Enums.FuelType;
                transmission: import(".prisma/client").$Enums.TransmissionType;
                condition: import(".prisma/client").$Enums.VehicleCondition;
                status: import(".prisma/client").$Enums.VehicleStatus;
                color: string | null;
                doors: number | null;
                seats: number | null;
                enginePower: number | null;
                engineSizeCc: number | null;
                city: string;
                latitude: number | null;
                longitude: number | null;
                viewsCount: number;
                averageRating: number;
                reviewsCount: number;
                modelId: string;
                categoryId: string;
                sellerId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            vehicleId: string;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
            orderId: string;
        })[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            amount: number;
            transactionRef: string | null;
            paidAt: Date | null;
            failureReason: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        billingAddressId: string | null;
        shippingAddressId: string | null;
        notes: string | null;
        orderNumber: string;
        subtotal: number;
        taxAmount: number;
        shippingAmount: number;
        totalAmount: number;
        buyerId: string;
    })[]>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        items: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
            orderId: string;
        }[];
        buyer: {
            email: string;
            firstName: string;
            lastName: string;
        };
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            amount: number;
            transactionRef: string | null;
            paidAt: Date | null;
            failureReason: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        billingAddressId: string | null;
        shippingAddressId: string | null;
        notes: string | null;
        orderNumber: string;
        subtotal: number;
        taxAmount: number;
        shippingAmount: number;
        totalAmount: number;
        buyerId: string;
    })[]>;
    findOne(id: string, requesterId: string, isAdmin?: boolean): Promise<{
        items: ({
            vehicle: {
                images: {
                    id: string;
                    createdAt: Date;
                    url: string;
                    altText: string | null;
                    position: number;
                    isPrimary: boolean;
                    vehicleId: string;
                }[];
            } & {
                isFeatured: boolean;
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                country: string;
                currency: string;
                slug: string;
                brandId: string;
                title: string;
                vin: string | null;
                year: number;
                price: number;
                mileage: number;
                mileageUnit: string;
                fuelType: import(".prisma/client").$Enums.FuelType;
                transmission: import(".prisma/client").$Enums.TransmissionType;
                condition: import(".prisma/client").$Enums.VehicleCondition;
                status: import(".prisma/client").$Enums.VehicleStatus;
                color: string | null;
                doors: number | null;
                seats: number | null;
                enginePower: number | null;
                engineSizeCc: number | null;
                city: string;
                latitude: number | null;
                longitude: number | null;
                viewsCount: number;
                averageRating: number;
                reviewsCount: number;
                modelId: string;
                categoryId: string;
                sellerId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            vehicleId: string;
            unitPrice: number;
            quantity: number;
            totalPrice: number;
            orderId: string;
        })[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            provider: import(".prisma/client").$Enums.PaymentProvider;
            amount: number;
            transactionRef: string | null;
            paidAt: Date | null;
            failureReason: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        billingAddressId: string | null;
        shippingAddressId: string | null;
        notes: string | null;
        orderNumber: string;
        subtotal: number;
        taxAmount: number;
        shippingAmount: number;
        totalAmount: number;
        buyerId: string;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        billingAddressId: string | null;
        shippingAddressId: string | null;
        notes: string | null;
        orderNumber: string;
        subtotal: number;
        taxAmount: number;
        shippingAmount: number;
        totalAmount: number;
        buyerId: string;
    }>;
}
