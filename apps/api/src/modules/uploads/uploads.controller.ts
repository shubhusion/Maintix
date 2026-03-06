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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201, description: 'File uploaded and attachment record created' })
  @ApiResponse({ status: 400, description: 'Invalid file type, file too large, or attachment limit reached' })
  @ApiResponse({ status: 403, description: 'Not a member of this property' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
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
  @ApiResponse({ status: 200, description: 'List of attachments for the ticket' })
  @ApiResponse({ status: 403, description: 'Not a member of the ticket property' })
  getAttachments(
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.uploadsService.getAttachments(ticketId, user.sub);
  }

  @Delete('attachments/:id')
  @ApiOperation({ summary: 'Delete an attachment' })
  @ApiResponse({ status: 200, description: 'Attachment deleted from storage and database' })
  @ApiResponse({ status: 403, description: 'Forbidden — only the uploader can delete their attachments' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  delete(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.uploadsService.deleteAttachment(id, user.sub);
  }
}
