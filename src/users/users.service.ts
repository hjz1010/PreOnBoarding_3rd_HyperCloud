import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { Follow, Reason, User } from "./user.entity";
import { FollowRepository, ReasonRepository, UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { Comment, Reaction, Posting } from "src/postings/posting.entity";
import { CommentRepository, ReactionRepository, PostingRepository } from "src/postings/posting.repository";
import { Connection, Like } from "typeorm";

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

        @InjectRepository(Reaction)
        private reactionRepository: ReactionRepository,

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
            throw new NotFoundException('????????? ???????????????.')
        }

        if (user && await bcrypt.compare(password, user.password)) {
            const payload = { email }
            const accessToken = this.jwtService.sign(payload)
            
            return Object.assign({message : 'LOGIN SUCCESS', accessToken}); // { accessToken };
        } else {
            throw new UnauthorizedException('???????????? ??????????????? ??????????????????.')
        }
    }

    async updatePassword(user: User, updatePasswordDto: UpdatePasswordDto): Promise <string> {
        const { password, newPassword } = updatePasswordDto

        // ???????????? ?????????
        if (! await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('??????????????? ??????????????????.')
        }

        const salt = await bcrypt.genSalt();
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedNewPassword
        await this.userRepository.save(user)
        
        return Object.assign({message : 'UPDATE SUCCESS'})
    }

    async deleteUser(user: User, reason_id: number): Promise <string> {
        // ???????????? ??????
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            // ?????? ??? ?????? ????????? ???????????? ?????? ????????????(isDeleted = true) + ???????????? ??????
            const reason = await this.reasonRepository.findOne({where: {id: reason_id}})
            user.isDeleted = true
            user.reason = reason
            // await this.userRepository.save(user)
            await queryRunner.manager.save(user)

            // ?????????, ??????, ?????????, ?????????- ??? ????????? ???????????? 
            // ??????? ????????? ????????????? ????????? ??????????????? ??? ????????? ????????? ??????????????? ????????????
            // ???????????? ???????????? ??????, ????????? ???????????? ????????? null??????
            const comments = await this.commentRepository.find({user})
            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i]
                comment.user = null
                // this.commentRepository.save(comment)
                await queryRunner.manager.save(comment)
            }
    
            const reactions = await this.reactionRepository.find({user})
            for (let i = 0; i < reactions.length; i++) {
                let reaction = reactions[i]
                reaction.user = null
                // this.reactionRepository.save(reaction)
                await queryRunner.manager.save(reaction)
            }

            const postings: Posting[] = await this.postingRepository.find({where: { user: user}})
            for (let i = 0; i < postings.length; i++ ) {
                let posting = postings[i]
                
                // await this.commentRepository.delete({posting : posting})
                // await this.reactionRepository.delete({posting: posting})
                await queryRunner.manager.delete(Comment, {posting: posting})
                await queryRunner.manager.delete(Reaction, {posting: posting})
            }

            // await this.postingRepository.delete({user: user})
            await queryRunner.manager.delete(Posting, {user: user})

            // await this.followRepository.delete({follower : user})
            // await this.followRepository.delete({following : user})
            await queryRunner.manager.delete(Follow, {follower: user})
            await queryRunner.manager.delete(Follow, {following: user})

            // throw new InternalServerErrorException(); // ????????? ????????? ???????????? ??????

            await queryRunner.commitTransaction();

            return Object.assign({message : 'USER DELETED'})

        } catch (e) { // ????????? ???????????? ??????
            await queryRunner.rollbackTransaction();
            console.log('error: ', e)
            return Object.assign({message : 'USER TERMINATE FAIL!'})

        } finally { // ?????? ????????? QueryRunner??? ???????????? ????????? ???
            await queryRunner.release();
        }
    }

    async searchUserByEmail(part_of_email: string) {
        const users = this.userRepository.find({
            select: ['email'],
            where: {
                email: Like(`%${part_of_email}%`)
            }
        })

        return users
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
            throw new NotFoundException('???????????? ?????? ??????????????????.')
        } 
        
        if (following.id === user.id) {
            throw new BadRequestException('????????? ???????????? ??? ????????????.')
        }

        const follow = await this.followRepository.findOne({where: {follower: user, following: following}})

        if (!follow) {
            const newFollow = this.followRepository.create({
                follower: user,
                following: following
            })
            this.followRepository.save(newFollow)
            return Object.assign({message: 'FOLLOW SUCCESS'})

        } else if (!!follow.isBlocked) {
            return Object.assign({message: 'BLOCKED FOLLOW'})

        } else {
            this.followRepository.delete(follow)

            return Object.assign({message: 'UNFOLLOW SUCCESS'})
        }
    }
}

@Injectable()
export class BlocksService {
    constructor(
        @InjectRepository(Follow)
        private followRepository: FollowRepository,

        @InjectRepository(User)
        private userRepository: UserRepository,
    ) {}

    async blockFollow(user: User, email: string) {
        const follower = await this.userRepository.findOne({where: {email}})
        let block = await this.followRepository.findOne({where: {following: user, follower: follower}}) 

        if (!block) {
            block = this.followRepository.create({
                following: user,
                follower: follower,
                isBlocked: true
            })
        } else {
            block.isBlocked = true
        }

        this.followRepository.save(block)
        return Object.assign({message: 'BLOCK SUCCESS'})
    }
}
