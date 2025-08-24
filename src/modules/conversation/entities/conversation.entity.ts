import { BaseEntity } from 'src/common/base/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('conversations')
export class ConversationEntity extends BaseEntity {

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({
    type: 'varchar',
    default: 'private',
  })
  conversation_type: 'private' | 'group' | 'channel';

  @Column({ type: 'uuid' })
  created_by: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  last_message_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
