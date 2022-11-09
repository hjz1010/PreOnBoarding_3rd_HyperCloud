import { type } from "os";
import { User } from "src/users/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class State extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @OneToMany(type => Posting, posting => posting.state)
    postings: Posting[]
}

@Entity()
export class Posting extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(type => User, user => user.postings, { eager: true }) 
    user: User;

    @OneToMany(type => Comment, comment => comment.posting ) 
    comments: Comment[];

    @OneToMany(type => Reaction, reaction => reaction.user) 
    reactions: Reaction[];

    @ManyToOne(type=> State, state => state.postings)
    state: State; 
}

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(type => Posting, posting => posting.comments )
    posting: Posting;

    @ManyToOne(type => User, user => user.comments) 
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

    @OneToMany(type => Reaction, reaction => reaction.emoticon)
    reactions: Reaction[];
}

@Entity()
export class Reaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Emoticon, emoticon => emoticon.reactions)
    emoticon: Emoticon;

    @ManyToOne(type => Posting, posting => posting.reactions)
    posting: Posting;

    @ManyToOne(type => User, user => user.reactions)
    user: User;
}
