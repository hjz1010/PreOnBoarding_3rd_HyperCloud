import { EntityRepository, Repository } from "typeorm";
import { Follow, Reason, User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

}

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow> {
    
}

@EntityRepository(Reason)
export class ReasonRepository extends Repository<Reason> {
    
}