import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SingleOutput } from 'shared/output/single-output';
import { ErrorOutput } from 'shared/output/error-output';
import { ListOutput } from 'shared/output/list-output';
import { IUser } from 'core/repositoriess/user/user.interface';
import { Response } from 'express';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUser } from './dto/response.user.dto';
import { GetParamUserDto, GetQueryUserDto } from './dto/get.user.dto';
import { DeleteOutputDTO } from 'shared/output/dto/delete.output.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}
  singleOutput: SingleOutput<IUser> = new SingleOutput<IUser>();
  errorOutput: ErrorOutput = new ErrorOutput();
  listOutput: ListOutput<IUser> = new ListOutput();

  @ApiResponse({
    status: 201,
    type: ResponseUser,
    description: 'Create new User',
  })
  @Post('')
  async create(@Body() body: CreateUserDto, @Res() res: Response) {
    const user = await this.service.createUser(body);
    return this.singleOutput.single(res, user, 'user');
  }

  @ApiResponse({
    status: 200,
    type: ResponseUser,
    description: 'Get one User by Id',
  })
  @Get(':userId')
  async show(@Param() param: GetParamUserDto, @Res() res: Response) {
    const user = await this.service.showUser(param.userId);
    if (!user) {
      return this.errorOutput.notFound(res, 'user');
    }
    return this.singleOutput.single(res, user, 'user');
  }

  @ApiResponse({
    status: 200,
    type: ResponseUser,
    description: 'List all users',
  })
  @Get('')
  async list(@Res() res: Response, @Query() query: GetQueryUserDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;
    delete query.limit;
    delete query.offset;
    const users = await this.service.listUser(query, limit, offset);
    return this.listOutput.list(
      res,
      users,
      'user',
      offset,
      limit,
      await this.service.count(query),
    );
  }

  @ApiResponse({
    status: 200,
    type: ResponseUser,
    description: 'Update one user by Id',
  })
  @Put(':userId')
  async update(
    @Param() param: GetParamUserDto,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.service.updateUser(param.userId, body);
    return this.singleOutput.single(res, user, 'user');
  }

  @ApiResponse({
    status: 200,
    type: DeleteOutputDTO,
    description: 'Delete user by Id',
  })
  @Delete(':userId')
  async delete(@Param() param: GetParamUserDto, @Res() res: Response) {
    const user = await this.service.showUser(param.userId);
    if (!user) {
      return this.errorOutput.notFound(res, 'user');
    }
    await this.service.deleteUser(param.userId);
    return this.singleOutput.delete(res, true);
  }
}
