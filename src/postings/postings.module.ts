import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Like, Posting } from './posting.entity';
import { CommentsController, LikesController, PostingsController } from './postings.controller';
import { commentsService, LikesServices, PostingsService } from './postings.service';
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
    TypeOrmModule.forFeature([Posting, Comment, Like]),
  ],
  controllers: [PostingsController, CommentsController, LikesController],
  providers: [PostingsService, commentsService, LikesServices], 
})
export class PostingsModule {}
