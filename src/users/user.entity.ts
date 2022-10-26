import { Comment, Like, Posting } from "src/postings/posting.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(type=> Posting, posting => posting.user)
    postings: Posting[];

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment[];

    @OneToMany(type => Like, like => like.user)
    likes: Like[];

    @OneToMany(type => Follow, follow => follow.follower)
    followings: Follow[];

    @OneToMany(type => Follow, follow => follow.following)
    followers: Follow[];
}

@Entity()
export class Follow extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.followings)
    follower: User;

    @ManyToOne(type => User, user => user.followers)
    following: User;
}