import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMconfig } from './configs/typeorm.config';
import { UsersModule } from './users/users.module';
import { PostingsModule } from './postings/postings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMconfig),
    UsersModule,
    PostingsModule,  
  ],
})
export class AppModule {}
