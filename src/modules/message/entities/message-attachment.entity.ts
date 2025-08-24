import { BaseEntity } from 'src/common/base/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('message_attachments')
export class MessageAttachmentEntity extends BaseEntity {
  @Column()
  message_id: string;

  @Column()
  file_name: string;

  @Column()
  file_url: string;

  @Column()
  file_type: string;

  @Column('bigint')
  file_size: number;

  @Column({ nullable: true })
  thumbnail_url: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @ManyToOne(() => MessageEntity, (msg) => msg.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;
}
