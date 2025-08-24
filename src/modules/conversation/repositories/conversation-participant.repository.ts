import { BaseRepository } from 'src/common/base/base.repository';
import { DataSource } from 'typeorm';
import { ConversationParticipantEntity } from '../entities/conversation-participant';

export class ConversationPartipantRepository extends BaseRepository<ConversationParticipantEntity> {
//   constructor(private dataSource: DataSource) {
//     super(MessageEntity, dataSource.createEntityManager());
//   }
}
  