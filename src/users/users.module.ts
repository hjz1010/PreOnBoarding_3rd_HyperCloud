import { Module, Post } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "./jwt.strategy";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
    imports: [ 
      PassportModule.register({ defaultStrategy: 'jwt'}),
      JwtModule.register({
        secret: 'Secret1234',
        signOptions: {
          expiresIn: 60*60
        }
      }),
      TypeOrmModule.forFeature([User]),
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtStrategy], // 현재 모듈에서 사용하기 위해
    exports: [JwtStrategy, PassportModule]  // 다른 모듈에서 사용하기 위해 
  })
  export class UsersModule {}
  