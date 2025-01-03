import { Injectable } from '@nestjs/common';
import { BasePostgreSQLRepository } from '../base.postgresql.repository';
import { EUser } from './typeorm/user.entity';
import { UserRepositoryInterface } from './user.repository.interface';
import { FindOptionsWhere, ILike } from 'typeorm';
import { IUser } from 'core/entities/user/user.interface';

@Injectable()
export class UserPostgreSQLRepository
  extends BasePostgreSQLRepository
  implements UserRepositoryInterface
{
  async add(user: IUser): Promise<IUser> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    const generatedEntity = await repository.save(this.toEntity(user));
    return this.fromEntity(generatedEntity);
  }

  private toEntity(input: IUser): EUser {
    const output = new EUser();
    output.name = input.name;
    output.email = input.email;
    output.password = input.password;
    return output;
  }

  async find(userId: number): Promise<IUser | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    const entity = await repository.findOne({ where: { userId } });
    if (!entity) {
      return undefined;
    }
    return this.fromEntity(entity);
  }

  async search(
    where: Partial<IUser> = {},
    limit?: number,
    offset?: number,
  ): Promise<IUser[]> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    const userEntity = await repository.find({
      where: this.getWhere(where),
      take: limit,
      skip: offset,
    });
    return userEntity.map((EUser) => this.fromEntity(EUser));
  }

  private fromEntity(input: EUser): IUser {
    return {
      userId: input.userId,
      name: input.name,
      email: input.email,
    };
  }

  async count(where: Partial<IUser> = {}): Promise<number> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    const userEntity = await repository.count({
      where: this.getWhere(where),
    });
    return userEntity;
  }

  private getWhere(user: Partial<IUser> = {}) {
    const where: FindOptionsWhere<EUser> = {};
    if (user.name) where.name = ILike(this.toWildcard(user.name));
    if (user.email) where.email = ILike(this.toWildcard(user.email));
    return where;
  }

  private toWildcard(value: string): string {
    const lowercaseValue = value.toLowerCase();
    return lowercaseValue.replaceAll('*', '%');
  }

  async update(
    userId: number,
    fields: Partial<IUser>,
  ): Promise<IUser | undefined> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    await repository.update({ userId }, this.toPartialEntity(fields));
    return await this.find(userId);
  }

  async delete(userId: number): Promise<boolean> {
    await this.init();
    const repository = this.dataSource().getRepository(EUser);
    await repository.delete({ userId });
    return true;
  }

  private toPartialEntity(input: Partial<IUser>): Partial<EUser> {
    const output = new EUser();
    output.name = input?.name;
    output.email = input?.email;
    output.password = input?.password;
    return output;
  }
}
