import { BaseService } from 'src/common/base/base.service';
import { MessageAttachmentEntity } from '../entities/message-attachment.entity';
import { MessageAttachmentRepository } from '../repositories/message-attachment.repository';

export class MessageAttachmentService extends BaseService<MessageAttachmentEntity> {
  constructor(protected readonly repository: MessageAttachmentRepository) {
    super(repository);
  }
}
