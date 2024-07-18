import { Module } from '@nestjs/common';
import { UserPostgreSQLRepository } from 'core/repositories/user/user.postgresql.repository';

@Module({
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserPostgreSQLRepository,
    },
  ],
  exports: ['UserRepository']
})

export class RepositoryModule {}
