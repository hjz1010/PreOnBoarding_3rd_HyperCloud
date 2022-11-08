import { User } from "src/users/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posting extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(type => User, user => user.postings, { eager: true })
    user: User;

    @OneToMany(type => Comment, comment => comment.posting, { eager: true } )
    comments: Comment[];

    @OneToMany(type => Like, like => like.user, { eager: true } )
    likes: Like[];
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


@Entity()
export class Emoticon extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    image: string;

    @OneToMany(type => Like, like => like.emoticon)
    likes: Like[];
}

@Entity()
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Emoticon, emoticon => emoticon.likes)
    emoticon: Emoticon;

    @ManyToOne(type => Posting, posting => posting.likes)
    posting: Posting;

    @ManyToOne(type => User, user => user.likes)
    user: User;
}
