import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { Follow, Reason, User } from "./user.entity";
import { FollowRepository, ReasonRepository, UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { Comment, Like, Posting } from "src/postings/posting.entity";
import { CommentRepository, likeRepository, PostingRepository } from "src/postings/posting.repository";
import { Connection } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: UserRepository,

        @InjectRepository(Reason)
        private reasonRepository: ReasonRepository,

        @InjectRepository(Posting)
        private postingRepository: PostingRepository,

        @InjectRepository(Follow)
        private followRepository: FollowRepository,

        @InjectRepository(Comment)
        private commentRepository: CommentRepository,

        @InjectRepository(Like)
        private likeRepository: likeRepository,

        private jwtService: JwtService,
        private connection: Connection
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

        if (user.isDeleted) {
            throw new NotFoundException('삭제된 계정입니다.')
        }

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
        // 트랜젝션 사용
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            // 해지 시 회원 정보를 삭제하지 않고 비식별화(isDeleted = true) + 해지사유 수집
            const reason = await this.reasonRepository.findOne({where: {id: reason_id}})
            user.isDeleted = true
            user.reason = reason
            // await this.userRepository.save(user)
            await queryRunner.manager.save(user)

            // 게시글, 댓글, 팔로우, 좋아요- 는 어떻게 처리할까 
            // 삭제? 이것도 비식별화? 정보를 남겨놓아야 할 이유가 없다고 판단되므로 삭제하자
            // 게시글과 팔로우는 삭제, 댓글과 좋아요는 유저만 null처리
            const comments = await this.commentRepository.find({user})
            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i]
                comment.user = null
                // this.commentRepository.save(comment)
                await queryRunner.manager.save(comment)
            }
    
            const likes = await this.likeRepository.find({user})
            for (let i = 0; i < likes.length; i++) {
                let like = likes[i]
                like.user = null
                // this.likeRepository.save(like)
                await queryRunner.manager.save(like)
            }

            const postings: Posting[] = await this.postingRepository.find({where: { user: user}})
            for (let i = 0; i < postings.length; i++ ) {
                let posting = postings[i]
                
                // await this.commentRepository.delete({posting : posting})
                // await this.likeRepository.delete({posting: posting})
                await queryRunner.manager.delete(Comment, {posting: posting})
                await queryRunner.manager.delete(Like, {posting: posting})
            }

            // await this.postingRepository.delete({user: user})
            await queryRunner.manager.delete(Posting, {user: user})

            // await this.followRepository.delete({follower : user})
            // await this.followRepository.delete({following : user})
            await queryRunner.manager.delete(Follow, {follower: user})
            await queryRunner.manager.delete(Follow, {following: user})

            // throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다

            await queryRunner.commitTransaction();

            return Object.assign({message : 'USER DELETED'})

        } catch (e) { // 에러가 발생하면 롤백
            await queryRunner.rollbackTransaction();
            console.log('error: ', e)
            return Object.assign({message : 'USER TERMINATE FAIL!'})

        } finally { // 직접 생성한 QueryRunner는 해제시켜 주어야 함
            await queryRunner.release();
        }
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