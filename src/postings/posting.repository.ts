import { EntityRepository, Repository } from "typeorm";
import { Comment, Emoticon, Posting, Reaction, State } from "./posting.entity";

@EntityRepository(Posting)
export class PostingRepository extends Repository<Posting> {}

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {}

@EntityRepository(Reaction)
export class ReactionRepository extends Repository<Reaction> {}

@EntityRepository(Emoticon)
export class EmoticonRepository extends Repository<Emoticon> {}

@EntityRepository(State)
export class StateRepository extends Repository<State> {}