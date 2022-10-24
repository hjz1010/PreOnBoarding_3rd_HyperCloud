import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Posting } from './posting.entity';
import { PostingRepository } from './posting.repository';

@Injectable()
export class PostingsService {
    constructor(
        @InjectRepository(Posting)
        private postingRepository: PostingRepository,
        // private jwtService: JwtService     
    ) {}

    async createPosting(content: string, user: User): Promise<Posting> {

        const posting = this.postingRepository.create({
            content,
            user
        })

        await this.postingRepository.save(posting)

        return Object.assign({message: 'POSTING SUCCESS', posting: {'user':user.email, 'content': posting.content}})
    }
    
    
}
