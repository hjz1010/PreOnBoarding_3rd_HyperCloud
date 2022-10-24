import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posting } from './posting.entity';
import { PostingsController } from './postings.controller';
import { PostingsService } from './postings.service';

@Module({
  imports: [ 
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'Secret1234',
      signOptions: {
        expiresIn: 60*60
      }
    }),
    TypeOrmModule.forFeature([Posting]),
  ],
  controllers: [PostingsController],
  providers: [PostingsService], //JwtStrategy
  // exports: [JwtStrategy, PassportModule]
})
export class PostingsModule {}
