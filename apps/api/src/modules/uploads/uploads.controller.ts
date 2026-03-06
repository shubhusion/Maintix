import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '@/common/decorators/current-user.decorator';
import { PropertyGuard } from '@/common/guards/property.guard';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('properties/:propertyId/tickets/:ticketId/attachments')
  @UseGuards(PropertyGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a ticket attachment' })
  upload(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.uploadsService.uploadTicketAttachment(ticketId, propertyId, file, user.sub);
  }

  @Get('tickets/:ticketId/attachments')
  @ApiOperation({ summary: 'Get attachments for a ticket' })
  getAttachments(
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.uploadsService.getAttachments(ticketId, user.sub);
  }

  @Delete('attachments/:id')
  @ApiOperation({ summary: 'Delete an attachment' })
  delete(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.uploadsService.deleteAttachment(id, user.sub);
  }
}
