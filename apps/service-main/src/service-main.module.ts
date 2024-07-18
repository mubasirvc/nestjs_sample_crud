import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath: [__dirname + '/../.env', __dirname + '/.env'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class ServiceMainModule {}
