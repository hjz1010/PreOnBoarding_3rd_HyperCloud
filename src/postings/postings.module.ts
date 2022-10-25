import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Posting } from './posting.entity';
import { CommentsController, PostingsController } from './postings.controller';
import { commentsService, PostingsService } from './postings.service';

@Module({
  imports: [ 
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'Secret1234',
      signOptions: {
        expiresIn: 60*60
      }
    }),
    TypeOrmModule.forFeature([Posting, Comment]),
  ],
  controllers: [PostingsController, CommentsController],
  providers: [PostingsService, commentsService], 
})
export class PostingsModule {}
