import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Comment, Posting } from './posting.entity';
import { CommentRepository, PostingRepository } from './posting.repository';

@Injectable()
export class PostingsService {
    constructor(
        @InjectRepository(Posting)
        private postingRepository: PostingRepository,
    ) {}

    async createPosting(content: string, user: User): Promise<Posting> {
        const posting = this.postingRepository.create({
            content,
            user
        })
        await this.postingRepository.save(posting)

        return Object.assign({message: 'POSTING SUCCESS', posting: {posting_id: posting.id, email: user.email, content: content}})
    }

    async getAllPostings(user: User): Promise<any> {
        const postings = await this.postingRepository.find({ where: { user: user}})
        return postings
    }

    async getPostingById(posting_id: string, user: User): Promise<Posting> {
        const posting = await this.postingRepository.findOne({ where: { id: posting_id }})

        if (posting.user.id !== user.id) {
            throw new UnauthorizedException();
        }
        return posting
    }
    
    async updatePosting(posting_id: string, content: string, user: User): Promise<Posting> {
        const posting = await this.getPostingById(posting_id, user)
        posting.content = content;
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

        const comment = this.commentRepository.create({
            text,
            posting,
            user
        })
        await this.commentRepository.save(comment)
        return comment
    }
}
