import { MessageAttachmentRepository } from './../repositories/message-attachment.repository';
import { BaseService } from 'src/common/base/base.service';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../repositories/message.repository';
import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from 'src/common/kafka/kafka.service';
import axios from 'axios';

@Injectable()
export class MessageService extends BaseService<MessageEntity> {
  constructor(
    protected readonly repository: MessageRepository,
    private readonly kafka: KafkaProducerService,
    private readonly messageAttachmentRepository: MessageAttachmentRepository,
    private readonly attachmentService: MessageAttachmentRepository,
  ) {
    super(repository);
  }

  async getMessagesWithUser(
    currentUserId: string,
    otherUserId: string,
    limit = 20,
    offset = 0,
  ) {
    let conversation = await this.repository.findPrivateConversation(
      currentUserId,
      otherUserId,
    );
    if (!conversation) {
      return [];
    }
    return this.repository.getMessagesByConversation(
      conversation.id,
      limit,
      offset,
    );
  }

  async sendMessageToUser(
    currentUserId: string,
    otherUserId: string,
    content: string,
  ) {
    let conversation = await this.repository.findPrivateConversation(
      currentUserId,
      otherUserId,
    );
    if (!conversation) {
      conversation = await this.repository.createPrivateConversation(
        currentUserId,
        otherUserId,
      );
    }

    const message = this.repository.create({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      content,
      message_type: 'text',
    });

    return this.repository.save(message);
  }

  async getAllMyMessages(currentUserId: string, limit = 50, offset = 0) {
    const list = await this.repository.getMyChatList(
      currentUserId,
      limit,
      offset,
    );

    return await Promise.all(
      list.map(async (l) => {
        const userRes = await axios.get(
          `${process.env.PHP_API}user/${l.otherUserId}`,
        );
        return {
          ...l,
          user: userRes.data.data,
        };
      }),
    );
  }

  async sendMessageWithAttachments(
    currentUserId: string,
    otherUserId: string,
    content: string,
    files: Express.Multer.File[],
  ) {
    // 1. Tìm hoặc tạo conversation
    let conversation = await this.repository.findPrivateConversation(
      currentUserId,
      otherUserId,
    );
    if (!conversation) {
      conversation = await this.repository.createPrivateConversation(
        currentUserId,
        otherUserId,
      );
    }

    // 2. Tạo message
    let messageType: 'text' | 'image' | 'file' = 'text';
    if (files && files.length > 0) {
      const mime = files[0].mimetype;
      if (mime.startsWith('image/')) {
        messageType = 'image';
      } else {
        messageType = 'file';
      }
    }

    const message = this.repository.create({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      content,
      message_type: messageType,
    });
    await this.repository.save(message);

    if (files.length > 0) {
      await Promise.all(
        files.map((file) =>
          this.messageAttachmentRepository.save(
            this.messageAttachmentRepository.create({
              message_id: message.id,
              file_name: file.originalname,
              file_url: `/uploads/messages/${file.filename}`,
              file_type: file.mimetype,
              file_size: file.size,
            }),
          ),
        ),
      );
    }

    return message;
  }
}
