import { EntityRepository, Repository } from "typeorm";
import { Comment, Like, Posting } from "./posting.entity";

@EntityRepository(Posting)
export class PostingRepository extends Repository<Posting> {

}

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
    
}

@EntityRepository(Like)
export class likeRepository extends Repository<Like> {
    
}