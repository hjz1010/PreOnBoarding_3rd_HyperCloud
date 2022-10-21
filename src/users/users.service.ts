import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { FollowRepository, UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private followRepository: FollowRepository
    ) {}

    async createUser(createUserDto: CreateUserDto) : Promise <string> {
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

    async logIn(createUserDto: CreateUserDto): Promise <string> { //<{accessToken: string}>
        const { email, password } = createUserDto
        const user = await this.userRepository.findOne({ email })

        if (user && await bcrypt.compare(password, user.password)) {
            const payload = { email }
            const accessToken = await this.jwtService.sign(payload)
            
            return Object.assign({message : 'LOGIN SUCCESS', accessToken}); // { accessToken };
        } else {
            throw new UnauthorizedException('아이디와 비밀번호를 확인해주세요.')
        }
    }

    async follow(user, following_email): Promise <string> {
        const following = await this.userRepository.findOne({email: following_email})

        const follow = this.followRepository.create({
            user_id: user.id,
            following_id: following.id
        })

        await this.followRepository.save(follow)
        return Object.assign({message : 'FOLLOWING SUCCESS'})

    }
}
