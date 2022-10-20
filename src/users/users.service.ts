import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./uer.entity";
import { UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: UserRepository
    ) {}

    async createUser(createUserDto: CreateUserDto) : Promise <User> {
        const { email, password } = createUserDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            email,
            password : hashedPassword
        })

        await this.userRepository.save(user);

        return Object.assign({message : 'SIGNUP SUCCESS'})
    } 
}