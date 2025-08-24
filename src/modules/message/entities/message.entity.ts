import { BaseEntity } from 'src/common/base/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageAttachmentEntity } from './message-attachment.entity';

@Entity('messages')
export class MessageEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  conversation_id: string;

  @Column({ type: 'uuid' })
  sender_id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'text' })
  message_type: 'text' | 'image' | 'file' | 'voice' | 'video' | 'system';

  @Column({ nullable: true })
  reply_to_message_id: string;

  @Column({ default: false })
  is_edited: boolean; 

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  sent_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  edited_at: Date;

  @OneToMany(() => MessageAttachmentEntity, (att) => att.message, {
    cascade: true,
  })
  attachments: MessageAttachmentEntity[];
}
 