import { EntityRepository, Repository } from "typeorm";
import { Post } from "./post.entity";


@EntityRepository(Post)
export class UserRepository extends Repository<Post> {

}
