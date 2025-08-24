import { BaseEntity } from 'src/common/base/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('conversation_participants')
export class ConversationParticipantEntity extends BaseEntity {

  @Column({ type: 'uuid' })
  conversation_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ default: 'member' })
  role: 'owner' | 'admin' | 'member';

  @CreateDateColumn({ type: 'timestamptz' }) 
  joined_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  left_at?: Date;

  @Column({ default: false })
  is_muted: boolean;

  @Column({ default: false })
  is_pinned: boolean;

  @Column({ type: 'uuid', nullable: true })
  last_read_message_id: string;
}
