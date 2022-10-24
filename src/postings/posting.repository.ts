import { EntityRepository, Repository } from "typeorm";
import { Posting } from "./posting.entity";

@EntityRepository(Posting)
export class PostingRepository extends Repository<Posting> {

}
