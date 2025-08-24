import { BaseRepository } from 'src/common/base/base.repository';
import { MessageEntity } from '../entities/message.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConversationEntity } from 'src/modules/conversation/entities/conversation.entity';
import { ConversationParticipantEntity } from 'src/modules/conversation/entities/conversation-participant';

@Injectable()
export class MessageRepository extends BaseRepository<MessageEntity> {
  constructor(private dataSource: DataSource) {
    super(MessageEntity, dataSource.createEntityManager());
  }

  async findPrivateConversation(userA: string, userB: string) {
    return this.dataSource
      .getRepository(ConversationEntity)
      .createQueryBuilder('c')
      .innerJoin(
        ConversationParticipantEntity,
        'p1',
        'p1.conversation_id = c.id AND p1.user_id = :userA',
        { userA },
      )
      .innerJoin(
        ConversationParticipantEntity,
        'p2',
        'p2.conversation_id = c.id AND p2.user_id = :userB',
        { userB },
      )
      .where('c.conversation_type = :type', { type: 'private' })
      .getOne();
  }

  async createPrivateConversation(userA: string, userB: string) {
    const conversationRepo = this.dataSource.getRepository(ConversationEntity);
    const participantRepo = this.dataSource.getRepository(
      ConversationParticipantEntity,
    );

    const conversation = await conversationRepo.save(
      conversationRepo.create({
        conversation_type: 'private',
        created_by: userA,
      }),
    );

    await participantRepo.save([
      participantRepo.create({
        conversation_id: conversation.id,
        user_id: userA,
        role: 'owner',
      }),
      participantRepo.create({
        conversation_id: conversation.id,
        user_id: userB,
        role: 'member',
      }),
    ]);

    return conversation;
  }

  async getMessagesByConversation(
    conversationId: string,
    limit = 20,
    offset = 0,
  ) {
    return this.createQueryBuilder('m')
      .leftJoinAndSelect('m.attachments', 'attachments')
      .where('m.conversation_id = :conversationId', { conversationId })
      .orderBy('m.sent_at', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }

  async getMyChatList(userId: string, limit = 50, offset = 0) {
    const qb = this.dataSource
      .getRepository(ConversationEntity)
      .createQueryBuilder('c')
      // participant của mình
      .innerJoin(
        ConversationParticipantEntity,
        'p_self',
        'p_self.conversation_id = c.id AND p_self.user_id = :userId',
        { userId },
      )
      // participant còn lại
      .innerJoin(
        ConversationParticipantEntity,
        'p_other',
        'p_other.conversation_id = c.id AND p_other.user_id != :userId',
        { userId },
      )
      // tin nhắn cuối
      .leftJoinAndMapOne(
        'c.lastMessage',
        MessageEntity,
        'm',
        'm.id = (SELECT m2.id FROM messages m2 WHERE m2.conversation_id = c.id ORDER BY m2.sent_at DESC LIMIT 1)',
      )
      .addSelect('p_other.user_id', 'otherUserId') // thêm cột này vào raw data
      .orderBy('m.sent_at', 'DESC')
      .take(limit)
      .skip(offset);

    const { entities, raw } = await qb.getRawAndEntities();

    return entities.map((conv, idx) => ({
      ...conv,
      otherUserId: raw[idx].otherUserId, // map id người kia
    }));
  }

  async getAllMessagesOfUser(userId: string, limit = 50, offset = 0) {
    return this.createQueryBuilder('m')
      .innerJoin(
        ConversationParticipantEntity,
        'p',
        'p.conversation_id = m.conversation_id',
      )
      .where('p.user_id = :userId', { userId })
      .orderBy('m.sent_at', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();
  }
}
