import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "./jwt.strategy";
import { Follow, User } from "./user.entity";
import { FollowsController, UsersController } from "./users.controller";
import { FollowsService, UsersService } from "./users.service";
import * as config from 'config';

const jwtConfig = config.get('jwt')

@Module({
    imports: [ 
      PassportModule.register({ defaultStrategy: 'jwt'}),
      JwtModule.register({
        secret: process.env.JWT_SECRET || jwtConfig.secret,
        signOptions: {
          expiresIn: jwtConfig.expiresIn
        }
      }),
      TypeOrmModule.forFeature([User, Follow]),
    ],
    controllers: [UsersController, FollowsController],
    providers: [UsersService, JwtStrategy, FollowsService],
    exports: [JwtStrategy, PassportModule]
  })
  export class UsersModule {}
  