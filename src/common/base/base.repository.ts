import { Repository, EntityTarget, DataSource } from 'typeorm';
import { BaseEntity } from './base.entity';

export class BaseRepository<T extends BaseEntity> extends Repository<T> {}
