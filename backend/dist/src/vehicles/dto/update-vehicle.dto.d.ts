import { VehicleStatus } from '@prisma/client';
import { CreateVehicleDto } from './create-vehicle.dto';
declare const UpdateVehicleDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateVehicleDto>>;
export declare class UpdateVehicleDto extends UpdateVehicleDto_base {
    status?: VehicleStatus;
}
export {};
