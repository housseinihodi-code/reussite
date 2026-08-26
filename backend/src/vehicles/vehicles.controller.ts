import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryVehicleDto } from './dto/query-vehicle.dto';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { RolesGuard } from '@/guards/roles.guard';
import { AuthenticatedUser } from '@/auth/types/authenticated-user.type';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Public()
  @Get()
  findAll(@Query() query: QueryVehicleDto) {
    return this.vehiclesService.findAll(query);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.vehiclesService.findBySlug(slug);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN, Role.SUPER_ADMIN)
  @Get('mine/listings')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.vehiclesService.findBySeller(user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateVehicleDto) {
    const isAdmin = user.roles.includes(Role.ADMIN) || user.roles.includes(Role.SUPER_ADMIN);
    return this.vehiclesService.create(user.id, dto, isAdmin);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateVehicleDto,
  ) {
    const isAdmin = user.roles.includes(Role.ADMIN) || user.roles.includes(Role.SUPER_ADMIN);
    return this.vehiclesService.update(id, user.id, dto, isAdmin);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const isAdmin = user.roles.includes(Role.ADMIN) || user.roles.includes(Role.SUPER_ADMIN);
    return this.vehiclesService.remove(id, user.id, isAdmin);
  }
}
