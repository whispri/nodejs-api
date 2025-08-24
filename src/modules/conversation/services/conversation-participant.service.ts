import { ConversationParticipantEntity } from './../entities/conversation-participant';
import { BaseService } from 'src/common/base/base.service';
import { ConversationPartipantRepository } from '../repositories/conversation-participant.repository';
export class ConversationParticipantService extends BaseService<ConversationParticipantEntity> {
  constructor(protected readonly repository: ConversationPartipantRepository) {
    super(repository);
  }
}
