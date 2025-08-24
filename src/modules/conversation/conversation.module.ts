import { Module } from '@nestjs/common';
import { ConversationEntity } from './entities/conversation.entity';
import { ConversationParticipantEntity } from './entities/conversation-participant';
import { ConversationService } from './services/conversation.service';
import { ConversationRepository } from './repositories/conversation.repository';


@Module({
  imports: [ConversationEntity, ConversationParticipantEntity],
  controllers: [],
  providers: [ConversationService,ConversationRepository],
  exports: [ConversationEntity,ConversationParticipantEntity]
})
export class ConversationModule {}
