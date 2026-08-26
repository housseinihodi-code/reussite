import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { IsEnum } from 'class-validator';
import { RoleName } from '@prisma/client';
import { AdminService } from './admin.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { RolesGuard } from '@/guards/roles.guard';

class AssignRoleDto {
  @IsEnum(RoleName)
  role: RoleName;
}

@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('vehicles/pending')
  findPendingVehicles() {
    return this.adminService.findPendingVehicles();
  }

  @Patch('vehicles/:id/approve')
  approveVehicle(@Param('id') id: string) {
    return this.adminService.approveVehicle(id);
  }

  @Patch('vehicles/:id/reject')
  rejectVehicle(@Param('id') id: string) {
    return this.adminService.rejectVehicle(id);
  }

  @Patch('users/:id/role')
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.adminService.assignRole(id, dto.role);
  }
}
