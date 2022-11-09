import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Emoticon, Posting, Reaction, State } from './posting.entity';
import { CommentsController, ReactionsController, PostingsController } from './postings.controller';
import { commentsService, ReactionsServices, PostingsService } from './postings.service';
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
    TypeOrmModule.forFeature([Posting, Comment, Reaction, Emoticon, State]),
  ],
  controllers: [PostingsController, CommentsController, ReactionsController],
  providers: [PostingsService, commentsService, ReactionsServices], 
})
export class PostingsModule {}
