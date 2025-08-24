import { Module } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { MessageAttachmentEntity } from './entities/message-attachment.entity';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';
import { MessageRepository } from './repositories/message.repository';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/base/base.repository';
import { KafkaProducerService } from 'src/common/kafka/kafka.service';
import { KafkaModule } from 'src/common/kafka/kafka.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/jwt.strategy';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConversationParticipantEntity } from '../conversation/entities/conversation-participant';
import { ConversationEntity } from '../conversation/entities/conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageAttachmentRepository } from './repositories/message-attachment.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      MessageEntity,
      MessageAttachmentEntity,
      ConversationEntity,              // 👈 Thêm vào đây
      ConversationParticipantEntity,   // 👈 Thêm vào đây
      MessageAttachmentRepository
    ]),
    KafkaModule,
    JwtModule.register({
      secret:
        'AEgQuKuIYQteQymBpMtAj6NgY4sDH9StTjnrm9jxqz506wdwACO88gAsUGpsjqQW',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageRepository,
    MessageAttachmentRepository,
    BaseRepository,
    JwtStrategy,
    JwtAuthGuard,
  ],
})
export class MessageModule {}
