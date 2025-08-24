import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { BaseEntity } from './base.entity';
import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

export class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findOneBy({ id } as any);
    if (!entity) {
      throw new NotFoundException(
        `${this.repository.target} with id ${id} not found`,
      );
    }
    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: QueryDeepPartialEntity<T>): Promise<T> {
    const result = await this.repository.update(id, data);
    if (result.affected === 0) {
      throw new NotFoundException(`Update failed. Entity not found`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Delete failed. Entity not found`);
    }
  }
}
