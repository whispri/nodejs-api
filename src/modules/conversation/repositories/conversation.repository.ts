import { BaseRepository } from 'src/common/base/base.repository';
import { DataSource } from 'typeorm';
import { ConversationEntity } from '../entities/conversation.entity';

export class ConversationRepository extends BaseRepository<ConversationEntity> {
//   constructor(private dataSource: DataSource) {
//     super(MessageEntity, dataSource.createEntityManager());
//   }
}
  