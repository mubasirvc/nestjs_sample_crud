import { Inject, Injectable } from '@nestjs/common';
import { IUser } from 'core/repositoriess/user/user.interface';
import { UserRepositoryInterface } from 'core/repositories/user/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private respository: UserRepositoryInterface,
  ) {}

  async createUser(body: IUser): Promise<IUser> {
    return await this.respository.add(body);
  }

  async showUser(userId: number): Promise<IUser | undefined> {
    return await this.respository.find(userId);
  }

  async listUser(where?: Partial<IUser>, limit?: number, offset?: number) {
    return await this.respository.search(where, limit, offset);
  }

  async count(where?: Partial<IUser>): Promise<number> {
    return await this.respository.count(where);
  }

  async updateUser(
    userId: number,
    body: Partial<IUser>,
  ): Promise<IUser | undefined> {
    return await this.respository.update(userId, body);
  }

  async deleteUser(userId: number): Promise<boolean> {
    return await this.respository.delete(userId);
  }
}
