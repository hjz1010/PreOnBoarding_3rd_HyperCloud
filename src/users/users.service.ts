import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { Follow, Reason, User } from "./user.entity";
import { FollowRepository, ReasonRepository, UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: UserRepository,

        @InjectRepository(Reason)
        private reasonRepository: ReasonRepository,

        private jwtService: JwtService
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
            const accessToken = this.jwtService.sign(payload)
            
            return Object.assign({message : 'LOGIN SUCCESS', accessToken}); // { accessToken };
        } else {
            throw new UnauthorizedException('아이디와 비밀번호를 확인해주세요.')
        }
    }

    async updatePassword(user: User, updatePasswordDto: UpdatePasswordDto): Promise <string> {
        const { password, newPassword } = updatePasswordDto

        // 비밀번호 재확인
        if (! await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('비밀번호를 확인해주세요.')
        }

        const salt = await bcrypt.genSalt();
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedNewPassword
        await this.userRepository.save(user)
        
        return Object.assign({message : 'UPDATE SUCCESS'})
    }

    async deleteUser(user: User, reason_id: number): Promise <string> {
        // 해지 시 회원 정보를 삭제하지 않고 비식별화(isDeleted = true) + 해지사유 수집
        const reason = await this.reasonRepository.findOne({where: {id: reason_id}})
        user.isDeleted = true
        user.reason = reason
        await this.userRepository.save(user)
        
        // 게시글, 댓글, 팔로우, 좋아요- 는 어떻게 처리할까

        return Object.assign({message : 'USER DELETED'})
    }
}

@Injectable()
export class FollowsService {
    constructor(
        @InjectRepository(Follow)
        private followRepository: FollowRepository,

        @InjectRepository(User)
        private userRepository: UserRepository,
    ) {}

    async followOrUnfollow(user: User, email: string): Promise<string>{
        const following = await this.userRepository.findOne({where: {email}})

        if (!following) {
            throw new NotFoundException('존재하지 않는 이메일입니다.')
        } 
        
        if (following.id === user.id) {
            throw new BadRequestException('자신을 팔로우할 수 없습니다.')
        }

        const follow = await this.followRepository.findOne({where: {follower: user, following: following}})

        if (!follow) {
            const newFollow = this.followRepository.create({
                follower: user,
                following: following
            })
            this.followRepository.save(newFollow)
            return Object.assign({message: 'FOLLOW SUCCESS'})

        } else {
            this.followRepository.delete(follow)

            return Object.assign({message: 'UNFOLLOW SUCCESS'})
        }
    }
}