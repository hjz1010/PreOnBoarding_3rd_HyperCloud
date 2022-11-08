import { EntityRepository, Repository } from "typeorm";
import { Comment, Emoticon, Like, Posting } from "./posting.entity";

@EntityRepository(Posting)
export class PostingRepository extends Repository<Posting> {

}

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
    
}

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {
    
}

@EntityRepository(Emoticon)
export class EmoticonRepository extends Repository<Emoticon> {}