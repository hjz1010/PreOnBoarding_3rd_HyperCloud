import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ForeignKeyMetadata } from "typeorm/metadata/ForeignKeyMetadata";

@Entity()
export class User extends BaseEntity { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
    
    // 팔로우 너무 어렵네 쉬운거부터 이해하고 오자
    // @OneToMany(()=> Follow, follow => follow.following )
    // following : Follow[]
}

@Entity()
export class Follow extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => User) // foreinKey로 만들어야하는데
    @JoinColumn()
    user: User;

    @ManyToMany(type => User, user => user.following)
    following: User[];
}