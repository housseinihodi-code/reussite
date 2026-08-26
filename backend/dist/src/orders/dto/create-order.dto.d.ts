declare class OrderItemInput {
    vehicleId: string;
}
export declare class CreateOrderDto {
    items: OrderItemInput[];
    billingAddressId?: string;
    shippingAddressId?: string;
    notes?: string;
}
export {};
