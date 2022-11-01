import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Comment, Like, Posting } from "src/postings/posting.entity";
import { Follow, Reason, User } from "src/users/user.entity";
import * as config from 'config';

const dbConfig = config.get('db')

export const typeORMconfig : TypeOrmModuleOptions = {

        "type": dbConfig.type,
        "host": process.env.RDS_HOSTNAME || dbConfig.host,
        "port": process.env.RDS_PORT || dbConfig.port,
        "username": process.env.RDS_USERNAME || dbConfig.username,
        "password": process.env.RDS_PASSWORD || dbConfig.password,
        "database": process.env.RDS_DB_NAME || dbConfig.database,
        "entities": [User, Posting, Comment, Like, Follow, Reason], 
        // "entities" : [__dirname + '/../**/*.entity.{js.ts}'], // 이건 왜 안되지 ㅠㅠ
        "synchronize": dbConfig.synchronize
}
