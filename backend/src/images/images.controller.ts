import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ImagesService } from './images.service';
import { AddImageDto } from './dto/add-image.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { AuthenticatedUser } from '@/auth/types/authenticated-user.type';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  add(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddImageDto) {
    return this.imagesService.add(user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.imagesService.remove(id, user.id);
  }

  @Patch(':id/primary')
  setPrimary(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.imagesService.setPrimary(id, user.id);
  }
}
