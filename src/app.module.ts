import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMconfig } from './configs/typeorm.config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMconfig),
    UsersModule,
    PostsModule,  
  ],
})
export class AppModule {}
