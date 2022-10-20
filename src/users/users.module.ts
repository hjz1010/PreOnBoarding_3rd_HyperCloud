import { Module, Post } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
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
    providers: [UsersService],
  })
  export class UsersModule {}
  