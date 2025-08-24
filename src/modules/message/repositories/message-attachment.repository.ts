import { BaseRepository } from 'src/common/base/base.repository';
import { MessageEntity } from '../entities/message.entity';
import { MessageAttachmentEntity } from '../entities/message-attachment.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageAttachmentRepository extends BaseRepository<MessageAttachmentEntity> {
     constructor(private dataSource: DataSource) {
        super(MessageAttachmentEntity, dataSource.createEntityManager());
      }
}
