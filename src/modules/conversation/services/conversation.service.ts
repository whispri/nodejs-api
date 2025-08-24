import { BaseService } from 'src/common/base/base.service';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationRepository } from '../repositories/conversation.repository';
export class ConversationService extends BaseService<ConversationEntity> {
  constructor(protected readonly repository: ConversationRepository) {
    super(repository);
  }
}
