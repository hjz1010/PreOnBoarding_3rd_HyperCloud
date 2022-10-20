import { EntityRepository, Repository } from "typeorm";
import { User } from "./uer.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

}
