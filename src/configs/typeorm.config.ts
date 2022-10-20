import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";


export const typeORMconfig : TypeOrmModuleOptions = {

        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "password1!",
        "database": "hyper_cloud",
        "entities": [User], 
        "synchronize": true 
}
