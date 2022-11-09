import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreatePostingDto } from './dto/create-posting.dto';
import { Comment, Emoticon, Reaction, Posting, State } from './posting.entity';
import { CommentRepository, EmoticonRepository, ReactionRepository, PostingRepository, StateRepository } from './posting.repository';

@Injectable()
export class PostingsService {
    constructor(
        @InjectRepository(Posting)
        private postingRepository: PostingRepository,

        @InjectRepository(State)
        private stateRepository: StateRepository,
    ) {}

    async createPosting(content: string, state_id: number, user: User): Promise<Posting> {
        const state = await this.stateRepository.findOne(state_id)
        const posting = this.postingRepository.create({
            content,
            state,
            user,
        })
        await this.postingRepository.save(posting)

        return Object.assign({message: 'POSTING SUCCESS', posting: {posting_id: posting.id, email: user.email, content: content}})
    }

    async getAllPostings(user: User): Promise<Posting[]> {
        const postings = await this.postingRepository.find({ where: { user: user}})
        return postings
    }

    async getPostingById(posting_id: string, user: User): Promise<Posting> {
        const posting = await this.postingRepository.findOne({ where: { id: posting_id }})

        // if (posting.user.id !== user.id) {
        //     throw new UnauthorizedException();
        // }
        return posting
    }
    
    async updatePosting(posting_id: string, createCommentDto: CreatePostingDto, user: User): Promise<Posting> {
        const posting = await this.getPostingById(posting_id, user)
        posting.content = createCommentDto.content;
        posting.state = await this.stateRepository.findOne(createCommentDto.state_id)
        await this.postingRepository.save(posting)

        return Object.assign({message: 'UPDATE SUCCESS', posting: {posting_id: posting.id, email: user.email, content: posting.content}})
    }

    async deletePosting(posting_id: string, user: User): Promise<string> {
        await this.getPostingById(posting_id, user)
        await this.postingRepository.delete(posting_id)

        return Object.assign({message: 'DELETE SUCCESS'})
    }   
}

@Injectable()
export class commentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: CommentRepository,

        @InjectRepository(Posting)
        private postingRepository: PostingRepository,
    ) {}

    async createComment(text: string, posting_id: string, user: User): Promise<Comment> {
        const posting = await this.postingRepository.findOne({where : {id: posting_id}})

        if (!posting) {
            throw new NotFoundException('존재하지 않는 포스팅입니다.')
        }

        const comment = this.commentRepository.create({
            text,
            posting,
            user
        })
        await this.commentRepository.save(comment)
        return comment
    }
}

@Injectable()
export class ReactionsServices  {
    constructor(
        @InjectRepository(Reaction)
        private reactionRepository: ReactionRepository,

        @InjectRepository(Posting)
        private postingRepository: PostingRepository,
        // private postingService: PostingsService,

        @InjectRepository(Emoticon)
        private emoticonRepository: EmoticonRepository,
    ) {}

    async createOrDeleteReaction(posting_id: string, user: User, emoticon_id: string): Promise<string> {
        // const posting = await this.postingService.getPostingById(posting_id, user) 
                                // TypeError: this.postingService.getPostingById is not a function
        const posting = await this.postingRepository.findOne({where : {id: posting_id}})

        if (!posting) {
            throw new NotFoundException('존재하지 않는 포스팅입니다.')
        }
        
        const reaction = await this.reactionRepository.findOne({where: {posting: posting, user: user}})

        if (!reaction) {
            const emoticon = await this.emoticonRepository.findOne(emoticon_id)
            const createReaction = this.reactionRepository.create({
                posting,
                user,
                emoticon
            })
            await this.reactionRepository.save(createReaction)
            return Object.assign({message: 'CREATE REACTION SUCCESS'})

        } else {
            await this.reactionRepository.delete(reaction)
            return Object.assign({message: 'DELETE REACTION SUCCESS'})
        }
    }
}
