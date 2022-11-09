import { Comment, Posting } from "src/postings/posting.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reason extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @OneToMany(type => User, user => user.reason)
    users: User[] 
}

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

    @OneToMany(type => Reason, reason => reason.users)
    reactions: Reason[];

    @OneToMany(type => Follow, follow => follow.follower)
    followings: Follow[];

    @OneToMany(type => Follow, follow => follow.following)
    followers: Follow[];

    @Column({default : false})
    isDeleted: boolean;

    @ManyToOne(type => Reason, reason => reason.users)
    reason: Reason;
}

@Entity()
export class Follow extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.followings)
    follower: User;

    @ManyToOne(type => User, user => user.followers)
    following: User;

    @Column({default : false})
    isBlocked: boolean;
}
