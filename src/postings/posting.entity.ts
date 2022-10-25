import { User } from "src/users/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posting extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(type => User, user => user.postings, { eager: true })
    user: User;

    @OneToMany(type => Comment, comment => comment.posting, { eager: true } )
    comments: Comment[]
}

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(type => Posting, posting => posting.comments )
    posting: Posting;

    @ManyToOne(type => User, user => user.comments, { eager: true } )
    user: User;
}
