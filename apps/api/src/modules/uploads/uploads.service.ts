import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '@/common/database/prisma.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorCode, STORAGE_BUCKET, MAX_UPLOAD_SIZE, ALLOWED_FILE_TYPES, MAX_ATTACHMENTS_PER_TICKET } from '@maintix/shared-types';

@Injectable()
export class UploadsService {
  private supabase: SupabaseClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.supabase = createClient(
      this.config.getOrThrow('SUPABASE_URL'),
      this.config.getOrThrow('SUPABASE_SERVICE_KEY'),
    );
  }

  async uploadTicketAttachment(
    ticketId: string,
    propertyId: string,
    file: Express.Multer.File,
    userId: string,
  ) {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      throw new BusinessException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
        ErrorCode.UPLOAD_TYPE_NOT_ALLOWED,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate file size
    if (file.size > MAX_UPLOAD_SIZE) {
      throw new BusinessException(
        `File size exceeds the maximum allowed size of ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB`,
        ErrorCode.UPLOAD_SIZE_EXCEEDED,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check attachment count limit
    const existingCount = await this.prisma.ticketAttachment.count({
      where: { ticketId },
    });

    if (existingCount >= MAX_ATTACHMENTS_PER_TICKET) {
      throw new BusinessException(
        `Maximum of ${MAX_ATTACHMENTS_PER_TICKET} attachments per ticket`,
        ErrorCode.UPLOAD_LIMIT_REACHED,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify ticket exists
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId, deletedAt: null },
    });

    if (!ticket) {
      throw new BusinessException(
        'Ticket not found',
        ErrorCode.TICKET_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    // Build storage path: {propertyId}/{ticketId}/{uuid}-{originalName}
    const fileUuid = uuidv4();
    const storagePath = `${propertyId}/${ticketId}/${fileUuid}-${file.originalname}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await this.supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw new BusinessException(
        'Failed to upload file',
        ErrorCode.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    // Create attachment record
    const attachment = await this.prisma.ticketAttachment.create({
      data: {
        ticketId,
        uploadedById: userId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        url: urlData.publicUrl,
      },
    });

    return attachment;
  }

  async deleteAttachment(attachmentId: string, userId: string) {
    const attachment = await this.prisma.ticketAttachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      throw new BusinessException(
        'Attachment not found',
        ErrorCode.ATTACHMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    // Only the uploader can delete
    if (attachment.uploadedById !== userId) {
      throw new BusinessException(
        'You can only delete your own attachments',
        ErrorCode.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      );
    }

    // Delete from Supabase Storage - reconstruct path from URL
    const urlParts = new URL(attachment.url);
    const storagePath = urlParts.pathname.split(`/${STORAGE_BUCKET}/`)[1] || '';
    const { error } = await this.supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      throw new BusinessException(
        'Failed to delete file from storage',
        ErrorCode.INTERNAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Delete record
    await this.prisma.ticketAttachment.delete({
      where: { id: attachmentId },
    });

    return { deleted: true };
  }

  async getAttachments(ticketId: string) {
    return this.prisma.ticketAttachment.findMany({
      where: { ticketId },
      include: {
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
